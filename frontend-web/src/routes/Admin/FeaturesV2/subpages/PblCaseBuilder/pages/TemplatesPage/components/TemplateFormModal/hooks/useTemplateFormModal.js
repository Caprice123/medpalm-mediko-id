import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  createAdminSkripsiTemplate,
  updateAdminSkripsiTemplate,
  fetchAdminSkripsiTemplate,
  clearAdminSkripsiTemplateDetail,
} from '@store/skripsi/v2'
import { actions as commonActions } from '@store/common/reducer'

const emptySection = () => ({ title: '' })

const emptyForm = () => ({
  name: '',
  description: '',
  sections: [emptySection()],
})

// The form behind "Tambah Template" and "Ubah". The outline is edited as one
// list and written back as one list, which is also how the server stores it.
//
// A listing row carries no sections — the table only draws a count — so
// opening the form on an existing template reads that template first, and the
// fields fill when it arrives.
export const useTemplateFormModal = ({ isOpen, template, onClose }) => {
  const dispatch = useDispatch()
  const isSaving = useSelector(state => state.skripsiV2.loading.isSavingTemplate)
  const isLoading = useSelector(state => state.skripsiV2.loading.isFetchingAdminTemplateDetail)
  const detail = useSelector(state => state.skripsiV2.adminTemplateDetail)

  const [form, setForm] = useState(emptyForm())

  // Creating starts blank; editing starts blank too, until the read lands.
  useEffect(() => {
    if (!isOpen) {
      dispatch(clearAdminSkripsiTemplateDetail())
      return
    }

    setForm(emptyForm())
    if (template?.id) dispatch(fetchAdminSkripsiTemplate(template.id))
  }, [isOpen, template?.id, dispatch])

  // The detail is what fills the fields. It is matched against the row being
  // edited so a stale answer for a template closed in the meantime cannot
  // overwrite what is on screen.
  useEffect(() => {
    if (!isOpen || !template?.id || detail?.id !== template.id) return

    setForm({
      name: detail.name,
      description: detail.description || '',
      sections: (detail.sections || []).length > 0
        ? detail.sections.map(section => ({ title: section.title }))
        : [emptySection()],
    })
  }, [isOpen, template?.id, detail])

  const setField = (key) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const setSectionTitle = (index) => (event) => {
    const { value } = event.target
    setForm(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => (i === index ? { ...section, title: value } : section)),
    }))
  }

  const addSection = () => setForm(prev => ({ ...prev, sections: [...prev.sections, emptySection()] }))

  const removeSection = (index) => setForm(prev => ({
    ...prev,
    sections: prev.sections.length === 1
      ? [emptySection()]
      : prev.sections.filter((_, i) => i !== index),
  }))

  const moveSection = (index, direction) => setForm(prev => {
    const target = index + direction
    if (target < 0 || target >= prev.sections.length) return prev

    const sections = [...prev.sections]
    sections.splice(target, 0, sections.splice(index, 1)[0])
    return { ...prev, sections }
  })

  const handleSubmit = async () => {
    const sections = form.sections.filter(section => section.title.trim())

    if (!form.name.trim()) {
      dispatch(commonActions.setError('Nama template wajib diisi'))
      return
    }

    if (sections.length === 0) {
      dispatch(commonActions.setError('Template harus memiliki minimal satu bagian'))
      return
    }

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      sections,
    }

    if (template) {
      await dispatch(updateAdminSkripsiTemplate(template.id, payload))
    } else {
      await dispatch(createAdminSkripsiTemplate(payload))
    }

    onClose()
  }

  return {
    form,
    isLoading,
    setName: setField('name'),
    setDescription: setField('description'),
    setSectionTitle,
    addSection,
    removeSection,
    moveSection,
    isSaving,
    handleSubmit,
  }
}
