import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef } from 'react'
import { createMcqTopic, generateMcqQuestions } from '@store/mcq/action'
import { upload } from '@store/common/action'

export const useCreateTopic = (closeCallback) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.mcq)
  const { loading: commonLoading } = useSelector(state => state.common)
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      quizTimeLimit: 0,
      passingScore: 70,
      topicTags: [],
      departmentTags: [],
      universityTags: [],
      semesterTags: [],
      questions: [],
      status: 'draft',
      // Generation fields merged into Formik
      contentType: 'document',
      textContent: '',
      pdfFile: null,
      questionCount: 5,
      uploadedBlobId: null
    },
    onSubmit: async (values, { resetForm }) => {
      try {
        // Prepare questions with blobId instead of separate image fields
        const questions = values.questions.map((q, index) => ({
          question: q.question,
          blobId: q.image?.id || null, // Send blob ID in camelCase
          options: q.options,
          correct_answer: q.correct_answer,
          explanation: q.explanation || '',
          order: index
        }))

        // Build payload based on content type
        const topicData = {
          title: values.title.trim(),
          description: values.description.trim(),
          contentType: values.contentType === 'document' ? 'pdf' : 'text',
          quizTimeLimit: values.quizTimeLimit,
          passingScore: values.passingScore,
          status: values.status,
          questions: questions,
          tags: [...values.topicTags, ...values.departmentTags, ...values.universityTags, ...values.semesterTags].map(t => t.id)
        }

        // Add content or blobId based on contentType
        if (values.contentType === 'document') {
          // Document type: send blobId, no content
          topicData.blobId = values.uploadedBlobId
        } else {
          // Text type: send content, no blobId
          topicData.content = values.textContent.trim()
        }

        console.log('Create MCQ topic payload:', topicData)

        await dispatch(createMcqTopic(topicData))

        // Reset form (includes all generation fields)
        resetForm()

        // Close modal
        if (closeCallback) {
          closeCallback()
        }
      } catch (error) {
        console.error('Failed to create topic:', error)
      }
    }
  })

  const initialFormData = useRef(JSON.stringify(form.initialValues))

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(form.values) !== initialFormData.current
  }, [form.values])

  const onClose = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmClose(true)
      onClose.closeCallback = closeCallback
    } else {
      if (closeCallback) closeCallback()
    }
  }

  const handleConfirmClose = () => {
    setShowConfirmClose(false)
    if (onClose.closeCallback) {
      onClose.closeCallback()
      onClose.closeCallback = null
      form.resetForm()
    }
  }

  const handleCancelClose = () => {
    setShowConfirmClose(false)
    onClose.closeCallback = null
  }

  const handleAddQuestion = () => {
    form.setFieldValue('questions', [
      ...form.values.questions,
      {
        tempId: Date.now(),
        question: '',
        image: null, // Blob object: {id, url, key, filename}
        options: ['', '', '', ''], // Default 4 options
        correct_answer: 0, // Index of correct option
        explanation: '',
        order: form.values.questions.length
      }
    ])
  }

  const handleAddOption = (questionIndex) => {
    const question = form.values.questions[questionIndex]
    form.setFieldValue(`questions.${questionIndex}.options`, [...question.options, ''])
  }

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const question = form.values.questions[questionIndex]
    if (question.options.length <= 2) return // Minimum 2 options

    const newOptions = question.options.filter((_, i) => i !== optionIndex)
    form.setFieldValue(`questions.${questionIndex}.options`, newOptions)

    // Adjust correct_answer if needed
    if (question.correct_answer === optionIndex) {
      form.setFieldValue(`questions.${questionIndex}.correct_answer`, 0)
    } else if (question.correct_answer > optionIndex) {
      form.setFieldValue(`questions.${questionIndex}.correct_answer`, question.correct_answer - 1)
    }
  }

  const handleRemoveQuestion = (index) => {
    const updatedQuestions = form.values.questions.filter((_, i) => i !== index)
    // Update order for remaining questions
    const reorderedQuestions = updatedQuestions.map((q, idx) => ({
      ...q,
      order: idx
    }))
    form.setFieldValue('questions', reorderedQuestions)
  }

  const handleQuestionImageSelect = async (file, questionIndex) => {
    if (!file) return

    try {
      const result = await dispatch(upload(file, 'mcq'))
      form.setFieldValue(`questions.${questionIndex}.image`, {
        id: result.blobId, // Blob ID for backend
        url: result.url, // Temporary presigned URL for preview
        key: result.key,
        filename: result.filename,
        contentType: result.contentType,
        byteSize: result.byteSize
      })
    } catch (error) {
      console.error('Failed to upload question image:', error)
      alert('Failed to upload image. Please try again.')
    }
  }

  const handleRemoveQuestionImage = (questionIndex) => {
    form.setFieldValue(`questions.${questionIndex}.image`, null)
  }

  // Handle file selection and upload
  const handleFileSelect = async (file) => {
    if (file.type === 'application/pdf') {
      form.setFieldValue('pdfFile', file)

      // Immediately upload PDF to get blobId
      try {
        const uploadResult = await dispatch(upload(file, 'mcq'))

        if (uploadResult?.blobId) {
          form.setFieldValue('uploadedBlobId', uploadResult.blobId)
        } else {
          throw new Error('Upload failed - no blobId returned')
        }
      } catch (error) {
        console.error('Failed to upload PDF:', error)
        alert('Gagal upload PDF. Silakan coba lagi.')
        form.setFieldValue('pdfFile', null)
      }
    }
  }

  // Handle question generation
  const handleGenerate = async () => {
    try {
      const { contentType, uploadedBlobId, textContent, questionCount } = form.values

      if (contentType === 'document' && uploadedBlobId) {
        // Generate from newly uploaded PDF
        const questions = await dispatch(generateMcqQuestions({
          type: 'pdf',
          questionCount,
          blobId: uploadedBlobId
        }))

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
          alert('Gagal generate questions dari PDF')
          return
        }

        // Update form with generated questions
        const questionsWithTempIds = questions.map((q, index) => ({
          ...q,
          tempId: Date.now() + index,
          order: index
        }))
        form.setFieldValue('questions', questionsWithTempIds)
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const questions = await dispatch(generateMcqQuestions({
          content: textContent,
          type: 'text',
          questionCount
        }))

        if (!questions || !Array.isArray(questions) || questions.length === 0) {
          alert('Gagal generate questions dari text')
          return
        }

        // Update form with generated questions
        const questionsWithTempIds = questions.map((q, index) => ({
          ...q,
          tempId: Date.now() + index,
          order: index
        }))
        form.setFieldValue('questions', questionsWithTempIds)
      } else {
        // Validation
        if (contentType === 'document' && !uploadedBlobId) {
          alert('Silakan upload file PDF terlebih dahulu.')
        } else if (contentType === 'text' && !textContent.trim()) {
          alert('Silakan masukkan teks terlebih dahulu.')
        }
      }
    } catch (error) {
      console.error('Failed to generate MCQ questions:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat generate questions'
      alert(`Gagal generate questions: ${errorMessage}`)
    }
  }

  const canGenerate = form.values.contentType === 'document'
    ? form.values.uploadedBlobId !== null && !commonLoading.isUploading
    : !!form.values.textContent?.trim()

  const isGenerating = loading.isGenerating

  return {
    form,
    showConfirmClose,
    onChange: form.handleChange,
    onClose,
    handleConfirmClose,
    handleCancelClose,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddOption,
    handleRemoveOption,
    handleQuestionImageSelect,
    handleRemoveQuestionImage,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating
  }
}
