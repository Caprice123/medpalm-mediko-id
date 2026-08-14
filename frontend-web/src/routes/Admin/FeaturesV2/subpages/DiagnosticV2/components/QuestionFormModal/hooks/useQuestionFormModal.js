import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { upload } from '@store/common/action'
import { fetchDiagnosticQuestionDetail } from '@store/diagnosticNodes/adminAction'

const emptyForm = () => ({
  vignette: '',
  question: '',
  options: ['', '', '', ''],
  correctIndex: 0,
  explanationShort: '',
  explanationLong: '',
  imageCaption: '',
  blobId: null,
  imagePreviewUrl: null,
  imageFilename: null,
  references: [],
})

export function useQuestionFormModal({ nodeId, question, onSave }) {
  const dispatch = useDispatch()
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
    dispatch(fetchDiagnosticQuestionDetail(nodeId, question.id)).then((detail) => {
      if (cancelled) return
      const options = detail.choices?.length >= 2 ? detail.choices : ['', '', '', '']
      const correctIndex = Math.max(0, options.indexOf(detail.answer))
      setForm({
        vignette: detail.vignette ?? '',
        question: detail.question ?? '',
        options,
        correctIndex,
        explanationShort: detail.explanationShort || '',
        explanationLong: detail.explanationLong || '',
        imageCaption: detail.imageCaption ?? '',
        blobId: detail.imageBlobId ?? null,
        imagePreviewUrl: detail.imageUrl ?? null,
        imageFilename: null,
        references: Array.isArray(detail.references) ? detail.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
      })
    }).finally(() => { if (!cancelled) setIsLoadingDetail(false) })
    return () => { cancelled = true }
  }, [isEdit, question?.id])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const setOption = (i, val) =>
    setForm(f => { const opts = [...f.options]; opts[i] = val; return { ...f, options: opts } })

  const handleAddOption = () =>
    setForm(f => ({ ...f, options: [...f.options, ''] }))

  const handleRemoveOption = (i) => {
    if (form.options.length <= 2) return
    const newOptions = form.options.filter((_, idx) => idx !== i)
    const newCorrect = form.correctIndex === i ? 0 : form.correctIndex > i ? form.correctIndex - 1 : form.correctIndex
    setForm(f => ({ ...f, options: newOptions, correctIndex: newCorrect }))
  }

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, { label: '', url: '' }] }))
  const setReference = (index, key, val) =>
    setForm(f => {
      const references = [...f.references]
      references[index] = { ...references[index], [key]: val }
      return { ...f, references }
    })
  const removeReference = (index) => setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== index) }))

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'diagnostic-v2'))
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
      vignette: form.vignette || null,
      answerType: 'multiple_choice',
      choices: form.options,
      answer: form.options[form.correctIndex],
      explanationShort: form.explanationShort.trim(),
      explanationLong: form.explanationLong.trim(),
      imageBlobId: form.blobId,
      imageCaption: form.imageCaption || null,
      references: form.references
        .filter(r => r.label.trim() || r.url.trim())
        .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined })),
    }
    onSave(payload)
  }

  return {
    isEdit,
    isLoadingDetail,
    form, errors, set,
    setOption, handleAddOption, handleRemoveOption,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
  }
}
