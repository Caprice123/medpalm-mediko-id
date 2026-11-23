import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { generatePath, useNavigate } from 'react-router-dom'
import { createSet, deleteOwnTemplate, fetchSkripsiTemplates } from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'
import { PblBuilderRoute } from '../../../../routes'

// "Buat sendiri" is a choice in the same picker as the templates, but it is the
// absence of one — the report is created with no outline and the student adds
// the sections themselves.
export const CUSTOM_TEMPLATE = 'custom'

const emptyMember = () => ({ name: '', studentNumber: '' })

// What the page owns: which template is picked, how the student wants to fill
// it in, the PBL case and the group — and the one write that turns all of it
// into a report.
export const useCreateReport = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedTemplate, setSelectedTemplate] = useState(null)
  const [workMode, setWorkMode] = useState('manual')
  const [form, setForm] = useState({ title: '', caseText: '' })
  const [members, setMembers] = useState([emptyMember()])

  // Where the page scrolls to after a template is picked. Choosing one both
  // unlocks the steps below and folds the card grid away, so the page can
  // shrink by most of its height at once - without this the student is left
  // wherever the browser clamps the old scroll position to.
  const restRef = useRef(null)

  useEffect(() => {
    dispatch(fetchSkripsiTemplates())
  }, [dispatch])

  // Only step 1 is required, so there is one gate rather than one per step.
  const isTemplateChosen = Boolean(selectedTemplate)

  const selectTemplate = (templateId) => {
    setSelectedTemplate(templateId)

    // After the grid has collapsed and the steps have rendered unlocked, so
    // the scroll lands on where they actually are rather than on where the
    // dimmed block sat under a full-height card grid. React flushes a click's
    // updates synchronously, so one frame is enough.
    requestAnimationFrame(() => {
      restRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

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
    // Deleting the template that was picked re-locks the later steps, which is
    // right: there is no report to configure until something else is chosen.
    setSelectedTemplate(prev => (prev === templateId ? null : prev))
  }

  const handleSubmit = async () => {
    if (!isTemplateChosen) {
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
      navigate(generatePath(PblBuilderRoute.editorRoute, { setId: set.uniqueId }))
    }
  }

  return {
    selectedTemplate,
    selectTemplate,
    isTemplateChosen,
    restRef,
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
    canSubmit: isTemplateChosen,
    handleSubmit,
    handleCancel: () => navigate(PblBuilderRoute.moduleRoute),
  }
}
