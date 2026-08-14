import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNodeQuestion, updateNodeQuestion, fetchNodeQuestionDetail } from '@store/nodeQuestions'
import { upload } from '@store/common/action'

const emptyForm = () => ({
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanationShort: '',
  explanationLong: '',
  blobId: null,
  imagePreviewUrl: null,
  imageFilename: null,
  references: [],
})

export function useQuestionFormModal({ nodeId, question, onSuccess, onSave, isSavingOverride }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.nodeQuestions)

  const isEdit = !!question
  const [isLoadingDetail, setIsLoadingDetail] = useState(isEdit)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  // The list only gives us the summary row — fetch full detail (image, explanations,
  // references, linked notes) before letting the admin edit.
  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setIsLoadingDetail(true)
    dispatch(fetchNodeQuestionDetail(nodeId, question.id)).then((detail) => {
      if (cancelled) return
      setForm({
        question: detail.question ?? '',
        options: detail.options?.length >= 2 ? detail.options : ['', '', '', ''],
        correctIndex: detail.correctIndex ?? 0,
        explanationShort: detail.explanationShort || '',
        explanationLong: detail.explanationLong || '',
        blobId: detail.imageBlobId ?? null,
        imagePreviewUrl: detail.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(detail.references) ? detail.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
      })
    }).finally(() => { if (!cancelled) setIsLoadingDetail(false) })
    return () => { cancelled = true }
  }, [isEdit, question?.id])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, { label: '', url: '' }] }))
  const setReference = (index, key, val) =>
    setForm(f => {
      const references = [...f.references]
      references[index] = { ...references[index], [key]: val }
      return { ...f, references }
    })
  const removeReference = (index) => setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== index) }))

  const setOption = (index, val) =>
    setForm(f => {
      const options = [...f.options]
      options[index] = val
      return { ...f, options }
    })

  const handleAddOption = () =>
    setForm(f => ({ ...f, options: [...f.options, ''] }))

  const handleRemoveOption = (index) => {
    if (form.options.length <= 2) return
    const newOptions = form.options.filter((_, i) => i !== index)
    const newCorrect = form.correctIndex === index
      ? 0
      : form.correctIndex > index
        ? form.correctIndex - 1
        : form.correctIndex
    setForm(f => ({ ...f, options: newOptions, correctIndex: newCorrect }))
  }

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'mcq-v2'))
    setForm(f => ({ ...f, blobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const handleRemoveImage = () =>
    setForm(f => ({ ...f, blobId: null, imagePreviewUrl: null, imageFilename: null }))

  const validate = () => {
    const errs = {}
    if (!form.question.trim()) errs.question = 'Teks pertanyaan wajib diisi'
    if (form.options.some(o => !o.trim())) errs.options = 'Semua pilihan jawaban wajib diisi'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = {
      question: form.question,
      options: form.options,
      correctIndex: form.correctIndex,
      explanationShort: form.explanationShort.trim(),
      explanationLong: form.explanationLong.trim(),
      blobId: form.blobId,
      references: form.references
        .filter(r => r.label.trim() || r.url.trim())
        .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined })),
    }
    if (onSave) {
      onSave(payload, onSuccess)
    } else if (isEdit) {
      dispatch(updateNodeQuestion(nodeId, question.id, payload, onSuccess))
    } else {
      dispatch(addNodeQuestion(nodeId, payload, onSuccess))
    }
  }

  const isSaving = isSavingOverride ?? (isEdit ? loading.isUpdatingQuestion : loading.isAddingQuestion)

  return {
    isEdit,
    isLoadingDetail,
    form, errors, set,
    addReference, setReference, removeReference,
    setOption, handleAddOption, handleRemoveOption,
    handleImageUpload, handleRemoveImage, handleSubmit,
    isSaving,
  }
}
