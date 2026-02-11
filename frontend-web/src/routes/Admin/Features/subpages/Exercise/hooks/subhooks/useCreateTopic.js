import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  createExerciseTopic,
  fetchAdminExerciseTopics,
  generateQuestions,
  generateQuestionsFromPDF
} from '@store/exercise/adminAction'
import { upload } from '@store/common/action'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createTopicSchema } from '../../validationSchema/exerciseTopicSchema'

export const useCreateTopic = (onClose) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.exercise)
  const { loading: commonLoading } = useSelector(state => state.common)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      questions: [],
      topicTags: [],
      departmentTags: [],
      universityTags: [],
      semesterTags: [],
      status: 'draft',
      // Generation fields
      contentType: 'document',
      textContent: '',
      pdfFile: null,
      questionCount: 10,
      uploadedBlobId: null
    },
    validationSchema: createTopicSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Combine all tags
        const allTags = [...values.topicTags, ...values.departmentTags, ...values.universityTags, ...values.semesterTags]

        // Build payload based on content type
        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          contentType: values.contentType === 'document' ? 'pdf' : 'text',
          tags: allTags.map(t => t.id),
          status: values.status,
          questions: values.questions.map((q, index) => ({
            question: q.question,
            answer: q.answer,
            explanation: q.explanation,
            imageBlobId: q.imageBlobId || null,
            order: index
          }))
        }

        // Add content or blobId based on contentType
        if (values.contentType === 'document') {
          // Document type: send blobId, no content
          payload.blobId = values.uploadedBlobId
        } else {
          // Text type: send content, no blobId
          payload.content = values.textContent.trim()
        }

        console.log('Create payload:', payload)

        await dispatch(createExerciseTopic(payload))

        // Refresh the list
        await dispatch(fetchAdminExerciseTopics())

        // Reset form (includes all generation fields)
        resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        console.error('Failed to create exercise topic:', err)
        alert('Gagal menyimpan topik: ' + (err.message || 'Terjadi kesalahan'))
      }
    }
  })

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
      image: null,
      imageBlobId: null,
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
        // Generate from PDF using blobId (file already uploaded)
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
    : form.values.textContent.trim().length > 0

  const isGenerating = loading.isGeneratingQuestions

  // Handle question image upload
  const handleQuestionImageUpload = async (questionId, file) => {
    try {
      const uploadResult = await dispatch(upload(file, 'exercise'))

      if (uploadResult?.blobId) {
        // Find the question and update its image data
        const updatedQuestions = form.values.questions.map(q => {
          if (q.id === questionId) {
            return {
              ...q,
              imageBlobId: uploadResult.blobId,
              image: {
                blobId: uploadResult.blobId,
                url: uploadResult.url,
                filename: uploadResult.fileName
              }
            }
          }
          return q
        })
        form.setFieldValue('questions', updatedQuestions)
      } else {
        throw new Error('Upload failed - no blobId returned')
      }
    } catch (error) {
      console.error('Failed to upload question image:', error)
      alert('Gagal upload gambar. Silakan coba lagi.')
    }
  }

  // Handle question image remove
  const handleQuestionImageRemove = (questionId) => {
    const updatedQuestions = form.values.questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          imageBlobId: null,
          image: null
        }
      }
      return q
    })
    form.setFieldValue('questions', updatedQuestions)
  }

  return {
    form,
    sensors,
    handleAddQuestion,
    handleRemoveQuestion,
    handleDragEnd,
    handleFileSelect,
    handleGenerate,
    canGenerate,
    isGenerating,
    handleQuestionImageUpload,
    handleQuestionImageRemove
  }
}
