import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateExerciseTopic,
  fetchAdminExerciseTopics,
  generateQuestions,
  generateQuestionsFromPDF
} from '@store/exercise/adminAction'
import { upload } from '@store/common/action'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateTopicSchema } from '../../validationSchema/exerciseTopicSchema'

export const useUpdateTopic = (topicToEdit, onClose) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.exercise)
  const { loading: commonLoading } = useSelector(state => state.common)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      status: 'draft',
      questions: [],
      universityTags: [],
      semesterTags: [],
      blobId: null,
      // Generation fields
      contentType: 'document',
      textContent: '',
      pdfFile: null,
      questionCount: 10,
      uploadedBlobId: null
    },
    validationSchema: updateTopicSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!topicToEdit?.id) {
          console.error('No topic selected for update')
          return
        }

        // Prepare questions data - include ID to preserve question identity
        const questionsData = values.questions.map((question, index) => ({
          id: question.id, // Include ID to enable smart update (preserve performance tracking)
          question: question.question,
          answer: question.answer,
          explanation: question.explanation,
          order: index
        }))

        // Prepare tags - combine university and semester tags
        const allTags = [
          ...(values.universityTags || []),
          ...(values.semesterTags || [])
        ].map(tag => tag.id)

        // Prepare update payload
        const updatePayload = {
          title: values.title,
          description: values.description,
          contentType: values.contentType === 'document' ? 'pdf' : 'text',
          status: values.status,
          tags: allTags,
          questions: questionsData
        }

        // Add content or blobId based on contentType
        if (values.contentType === 'document') {
          // Document type: send blobId, no content
          if (values.uploadedBlobId) {
            updatePayload.blobId = values.uploadedBlobId
          } else if (values.blobId) {
            updatePayload.blobId = values.blobId
          }
        } else {
          // Text type: send content, remove blobId
          updatePayload.content = values.textContent.trim()
          updatePayload.blobId = null // Explicitly remove blobId
        }

        console.log('Update Payload:', updatePayload)
        console.log('Content Type:', values.contentType)
        console.log('Status being sent:', values.status)

        await dispatch(updateExerciseTopic(topicToEdit.id, updatePayload))

        // Refresh the list
        await dispatch(fetchAdminExerciseTopics())

        // Reset form
        resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to update exercise topic:', err)
        alert('Gagal update topik: ' + (err.message || 'Terjadi kesalahan'))
      }
    },
    enableReinitialize: true
  })

  // Populate form when topicToEdit changes
  useEffect(() => {
    if (topicToEdit) {
      // Map tags to the format expected by TagSelector
      const universityTags = topicToEdit.tags?.filter(tag =>
        tag.tagGroup?.name === 'university'
      ) || []

      const semesterTags = topicToEdit.tags?.filter(tag =>
        tag.tagGroup?.name === 'semester'
      ) || []

      // Add id to questions for drag-and-drop
      const questionsWithIds = topicToEdit.questions?.map((question, index) => ({
        ...question,
        id: question.id || Date.now() + index
      })) || []

      const value = {
          title: topicToEdit.title || '',
          description: topicToEdit.description || '',
          status: topicToEdit.status || 'draft',
          questions: questionsWithIds,
          universityTags: universityTags,
          semesterTags: semesterTags,
          blobId: topicToEdit.blob?.id || null
      }

      // Set initial content based on content_type
      if (topicToEdit.contentType === 'pdf' || topicToEdit.type === 'pdf') {
        value.contentType = "document"
        value.pdfFile = {
            name: topicToEdit.blob.filename,
            url: topicToEdit.blob.url,
            type: "application/pdf",
            size: topicToEdit.blob.size,
        }
    } else if (topicToEdit.content) {
          value.contentType = "text"
          value.textContent = topicToEdit.content
      }
      form.setValues(value)
    }
}, [topicToEdit])

  // Drag and drop sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleAddQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      answer: '',
      explanation: '',
      order: form.values.questions.length
    }
    form.setFieldValue('questions', [...form.values.questions, newQuestion])
  }

  const handleRemoveQuestion = (index) => {
    if (confirm('Apakah Anda yakin ingin menghapus soal ini?')) {
      const updatedQuestions = form.values.questions.filter((_, i) => i !== index)
      // Update order for remaining questions
      const reorderedQuestions = updatedQuestions.map((question, idx) => ({
        ...question,
        order: idx
      }))
      form.setFieldValue('questions', reorderedQuestions)
    }
  }

  // Drag and drop handler
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const questions = form.values.questions
      const oldIndex = questions.findIndex((question) => question.id === active.id)
      const newIndex = questions.findIndex((question) => question.id === over.id)

      const reorderedQuestions = arrayMove(questions, oldIndex, newIndex).map((question, idx) => ({
        ...question,
        order: idx
      }))

      form.setFieldValue('questions', reorderedQuestions)
    }
  }

  // Handle file selection and upload
  const handleFileSelect = async (file) => {
    if (file.type === 'application/pdf') {
      form.setFieldValue('pdfFile', file)

      // Immediately upload PDF to get blobId
      try {
        const uploadResult = await dispatch(upload(file, 'exercise'))

        if (uploadResult?.blobId) {
          form.setFieldValue('uploadedBlobId', uploadResult.blobId)
          form.setFieldValue('blobId', uploadResult.blobId)
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

  // Handle question generation (re-generation in update mode)
  const handleGenerate = async () => {
    try {
      const { contentType, uploadedBlobId, textContent, questionCount } = form.values

      if (contentType === 'document' && uploadedBlobId) {
        // Generate from newly uploaded PDF
        const result = await dispatch(generateQuestionsFromPDF(uploadedBlobId, questionCount))

        if (!result || !result.questions) {
          alert('Gagal generate soal dari PDF')
          return
        }

        // Update form with generated questions
        const questionsWithIds = result.questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        form.setFieldValue('questions', questionsWithIds)
      } else if (contentType === 'text' && textContent.trim()) {
        // Generate from text
        const questions = await dispatch(generateQuestions(textContent, 'text', questionCount))

        if (!questions || questions.length === 0) {
          return
        }

        // Update form with generated questions
        const questionsWithIds = questions.map((question, index) => ({
          ...question,
          id: Date.now() + index,
          order: index
        }))
        form.setFieldValue('questions', questionsWithIds)
      } else {
        // Validation
        if (contentType === 'document' && !uploadedBlobId) {
          alert('Silakan upload file PDF terlebih dahulu.')
        } else if (contentType === 'text' && !textContent.trim()) {
          alert('Silakan masukkan teks terlebih dahulu.')
        }
      }
    } catch (error) {
      console.error('Failed to generate questions:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Terjadi kesalahan saat generate soal'
      alert(`Gagal generate soal: ${errorMessage}`)
    }
  }

  const canGenerate = form.values.contentType === 'document'
    ? form.values.uploadedBlobId !== null && !commonLoading.isUploading
    : !!form.values.textContent?.trim()

  const isGenerating = loading.isGeneratingQuestions || commonLoading.isUploading

  return {
    form,
    sensors,
    handleAddQuestion,
    handleRemoveQuestion,
    handleDragEnd,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating
  }
}
