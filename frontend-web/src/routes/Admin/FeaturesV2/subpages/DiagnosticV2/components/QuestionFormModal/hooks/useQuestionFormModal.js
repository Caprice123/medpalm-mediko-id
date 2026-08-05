import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { upload } from '@store/common/action'

export function useQuestionFormModal({ question, onSave }) {
  const dispatch = useDispatch()
  const isEdit = !!question

  const [form, setForm] = useState({
    vignette: '',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    explanation: '',
    imageCaption: '',
    blobId: null,
    imagePreviewUrl: null,
    imageFilename: null,
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (isEdit) {
      const options = question.choices?.length >= 2 ? question.choices : ['', '', '', '']
      const correctIndex = Math.max(0, options.indexOf(question.answer))
      setForm({
        vignette: question.vignette ?? '',
        question: question.question ?? '',
        options,
        correctIndex,
        explanation: question.explanation ?? '',
        imageCaption: question.image_caption ?? question.imageCaption ?? '',
        blobId: question.imageBlobId ?? null,
        imagePreviewUrl: question.imageUrl ?? null,
        imageFilename: null,
      })
    }
  }, [isEdit, question])

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
      explanation: form.explanation || null,
      imageBlobId: form.blobId,
      imageCaption: form.imageCaption || null,
    }
    onSave(payload)
  }

  return {
    isEdit, form, errors, set,
    setOption, handleAddOption, handleRemoveOption,
    handleImageUpload, handleRemoveImage, handleSubmit,
  }
}
