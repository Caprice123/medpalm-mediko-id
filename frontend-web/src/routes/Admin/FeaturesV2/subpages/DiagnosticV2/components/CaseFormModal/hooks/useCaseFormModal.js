import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { upload } from '@store/common/action'
import { fetchDiagnosticCaseDetail } from '@store/diagnosticNodes/adminAction'
import { normalizeRichText } from '@utils/richTextUtils'

const emptyQuestion = () => ({
  id: null,
  question: '',
  answerType: 'multiple_choice',
  options: ['', '', '', ''],
  correctIndex: 0,
  textAnswer: '',
  explanationShort: '',
  explanationLong: '',
  references: [],
})

const emptyForm = () => ({
  vignette: '',
  imageCaption: '',
  blobId: null,
  imagePreviewUrl: null,
  imageFilename: null,
  explanation: '',
  references: [],
  questions: [emptyQuestion()],
})

const toFormQuestion = (q) => {
  const isText = q.answerType === 'text'
  const options = q.choices?.length >= 2 ? q.choices : ['', '', '', '']
  return {
    id: q.id,
    question: q.question ?? '',
    answerType: isText ? 'text' : 'multiple_choice',
    options,
    correctIndex: Math.max(0, options.indexOf(q.answer)),
    textAnswer: isText ? (q.answer ?? '') : '',
    explanationShort: q.explanationShort || '',
    explanationLong: q.explanationLong || '',
    references: Array.isArray(q.references) ? q.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
  }
}

export function useCaseFormModal({ nodeId, diagnosticCase, onSave }) {
  const dispatch = useDispatch()
  const isEdit = !!diagnosticCase

  const [isLoadingDetail, setIsLoadingDetail] = useState(isEdit)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})

  // The list only gives us the summary row — fetch full detail (image, case explanation,
  // references, every question) before letting the admin edit.
  useEffect(() => {
    if (!isEdit) return
    let cancelled = false
    setIsLoadingDetail(true)
    dispatch(fetchDiagnosticCaseDetail(nodeId, diagnosticCase.id)).then((detail) => {
      if (cancelled) return
      setForm({
        vignette: detail.vignette ?? '',
        imageCaption: detail.imageCaption ?? '',
        blobId: detail.imageBlobId ?? null,
        imagePreviewUrl: detail.imageUrl ?? null,
        imageFilename: null,
        explanation: detail.explanation || '',
        references: Array.isArray(detail.references) ? detail.references.map(r => ({ label: r.label || '', url: r.url || '' })) : [],
        questions: detail.questions?.length ? detail.questions.map(toFormQuestion) : [emptyQuestion()],
      })
    }).finally(() => { if (!cancelled) setIsLoadingDetail(false) })
    return () => { cancelled = true }
  }, [isEdit, diagnosticCase?.id])

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const updateQuestion = (index, updater) =>
    setForm(f => ({
      ...f,
      questions: f.questions.map((q, i) => (i === index ? updater(q) : q)),
    }))

  const setQuestionField = (index, key, val) => updateQuestion(index, q => ({ ...q, [key]: val }))

  const addQuestion = () => setForm(f => ({ ...f, questions: [...f.questions, emptyQuestion()] }))

  const removeQuestion = (index) =>
    setForm(f => (f.questions.length <= 1 ? f : { ...f, questions: f.questions.filter((_, i) => i !== index) }))

  const setQuestionOption = (index, optionIndex, val) =>
    updateQuestion(index, q => ({ ...q, options: q.options.map((o, i) => (i === optionIndex ? val : o)) }))

  const addQuestionOption = (index) =>
    updateQuestion(index, q => ({ ...q, options: [...q.options, ''] }))

  const removeQuestionOption = (index, optionIndex) =>
    updateQuestion(index, (q) => {
      if (q.options.length <= 2) return q
      const options = q.options.filter((_, i) => i !== optionIndex)
      const correctIndex = q.correctIndex === optionIndex
        ? 0
        : q.correctIndex > optionIndex ? q.correctIndex - 1 : q.correctIndex
      return { ...q, options, correctIndex }
    })

  const addQuestionReference = (index) =>
    updateQuestion(index, q => ({ ...q, references: [...q.references, { label: '', url: '' }] }))

  const setQuestionReference = (index, refIndex, key, val) =>
    updateQuestion(index, q => ({
      ...q,
      references: q.references.map((r, i) => (i === refIndex ? { ...r, [key]: val } : r)),
    }))

  const removeQuestionReference = (index, refIndex) =>
    updateQuestion(index, q => ({ ...q, references: q.references.filter((_, i) => i !== refIndex) }))

  const addReference = () => setForm(f => ({ ...f, references: [...f.references, { label: '', url: '' }] }))
  const setReference = (index, key, val) =>
    setForm(f => ({
      ...f,
      references: f.references.map((r, i) => (i === index ? { ...r, [key]: val } : r)),
    }))
  const removeReference = (index) =>
    setForm(f => ({ ...f, references: f.references.filter((_, i) => i !== index) }))

  const handleImageUpload = async (file) => {
    const result = await dispatch(upload(file, 'diagnostic-v2'))
    setForm(f => ({ ...f, blobId: result.blobId, imagePreviewUrl: result.url, imageFilename: result.filename }))
  }

  const handleRemoveImage = () =>
    setForm(f => ({ ...f, blobId: null, imagePreviewUrl: null, imageFilename: null }))

  const validate = () => {
    const errs = {}
    form.questions.forEach((q, i) => {
      if (!q.question.trim()) errs[`question-${i}`] = 'Teks pertanyaan wajib diisi'
      else if (q.answerType === 'text') {
        if (!q.textAnswer.trim()) errs[`answer-${i}`] = 'Jawaban benar wajib diisi'
      } else if (q.options.some(o => !o.trim())) {
        errs[`options-${i}`] = 'Semua pilihan jawaban wajib diisi'
      }
    })
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const cleanReferences = (references) =>
    references
      .filter(r => r.label.trim() || r.url.trim())
      .map(r => ({ label: r.label.trim(), url: r.url.trim() || undefined }))

  const handleSubmit = () => {
    if (!validate()) return
    onSave({
      vignette: form.vignette || null,
      imageBlobId: form.blobId,
      imageCaption: form.imageCaption || null,
      explanation: normalizeRichText(form.explanation),
      references: cleanReferences(form.references),
      questions: form.questions.map(q => ({
        id: q.id ?? undefined,
        question: q.question,
        answerType: q.answerType,
        choices: q.answerType === 'text' ? null : q.options,
        answer: q.answerType === 'text' ? q.textAnswer.trim() : q.options[q.correctIndex],
        explanationShort: normalizeRichText(q.explanationShort),
        explanationLong: normalizeRichText(q.explanationLong),
        references: cleanReferences(q.references),
      })),
    })
  }

  return {
    isEdit,
    isLoadingDetail,
    form, errors, set,
    setQuestionField, addQuestion, removeQuestion,
    setQuestionOption, addQuestionOption, removeQuestionOption,
    addQuestionReference, setQuestionReference, removeQuestionReference,
    addReference, setReference, removeReference,
    handleImageUpload, handleRemoveImage, handleSubmit,
  }
}
