import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { createSet, deleteOwnTemplate, reloadSkripsiTemplates } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { PblBuilderRoute } from '../../../../routes'

// "Buat sendiri" is a choice in the same picker as the templates, but it is the
// absence of one — the report is created with no outline and the student adds
// the sections themselves.
export const CUSTOM_TEMPLATE = 'custom'

// Two steps, not three. Picking a template is a screen's worth of work on its
// own — the catalogue is searched and paged — while everything that follows is
// optional and fits one form. "Cara mengerjakan" rides along at the top of
// that form rather than taking a screen of its own, because one of its two
// cards cannot be chosen yet.
export const STEPS = [
  { key: 'template', label: 'Pilih template' },
  { key: 'details', label: 'Detail laporan' },
]

const emptyMember = () => ({ name: '', studentNumber: '' })

// What the page owns: which step is showing, which template is picked, how the
// student wants to fill it in, the PBL case and the group — and the one write
// that turns all of it into a report.
export const useCreateReport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [stepIndex, setStepIndex] = useState(0)
  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [workMode, setWorkMode] = useState('manual')
  const [form, setForm] = useState({ title: '', caseText: '' })
  const [members, setMembers] = useState([emptyMember()])

  // Page 1 of the catalogue, with whatever search the student left behind on a
  // previous visit cleared: reloadSkripsiTemplates resets the page, and the
  // picker clears the term when it mounts.
  useEffect(() => {
    dispatch(reloadSkripsiTemplates())
  }, [dispatch])

  const setField = (key) => (event) => setForm(prev => ({ ...prev, [key]: event.target.value }))

  const setMemberField = (index, key) => (event) => {
    const { value } = event.target
    setMembers(prev => prev.map((member, i) => (i === index ? { ...member, [key]: value } : member)))
  }

  const addMember = () => setMembers(prev => [...prev, emptyMember()])

  const removeMember = (index) => setMembers(prev => (
    prev.length === 1 ? [emptyMember()] : prev.filter((_, i) => i !== index)
  ))

  const removeOwnTemplate = async (templateId) => {
    await dispatch(deleteOwnTemplate(templateId))
    setSelectedTemplate(prev => (prev === templateId ? null : prev))
  }

  const isTemplateChosen = Boolean(selectedTemplate)

  // The template step is the only one that can refuse to advance; the details
  // step has no required field, so its button is always live.
  const goNext = () => {
    if (!isTemplateChosen) {
      dispatch(commonActions.setError('Pilih template terlebih dahulu'))
      return
    }

    setStepIndex(1)
    // The two steps are different heights, so landing mid-page on the taller
    // one would start the student halfway down a form they have not read.
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goBack = () => {
    setStepIndex(0)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async () => {
    if (!isTemplateChosen) {
      // Only reachable if the template is unpicked after the fact — deleting
      // one's own template while standing on step 2 does exactly that.
      setStepIndex(0)
      dispatch(commonActions.setError('Pilih template terlebih dahulu'))
      return
    }

    const templateId = selectedTemplate === CUSTOM_TEMPLATE ? null : selectedTemplate

    // Empty rows are the normal state of the last member row, so they are
    // dropped here rather than being validated at the student.
    const filledMembers = members.filter(member => member.name.trim())

    const set = await dispatch(createSet(form.title.trim(), '', {
      templateId,
      workMode,
      caseText: form.caseText.trim(),
      members: filledMembers,
    }))

    if (set?.uniqueId) {
      // "Generate sekaligus" does not run here. The editor opens first and
      // fills itself in while the student watches, which is both the better
      // wait and the honest one: the work is the page's, so it lasts exactly
      // as long as the page does.
      navigate(generatePath(PblBuilderRoute.editorRoute, { setId: set.uniqueId }), {
        state: workMode === 'generate' ? { autoGenerate: true } : undefined,
      })
    }
  }

  return {
    stepIndex,
    goNext,
    goBack,
    selectedTemplate,
    selectTemplate: setSelectedTemplate,
    isTemplateChosen,
    removeOwnTemplate,
    workMode,
    selectWorkMode: setWorkMode,
    form,
    setTitle: setField('title'),
    setCaseText: setField('caseText'),
    members,
    setMemberField,
    addMember,
    removeMember,
    handleSubmit,
    handleCancel: () => navigate(PblBuilderRoute.moduleRoute),
  }
}
