import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import {
  createExerciseTopic,
  fetchAdminExerciseTopics
} from '@store/exercise/adminAction'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { createTopicSchema } from '../../validationSchema/exerciseTopicSchema'

export const useCreateTopic = (onClose) => {
  const dispatch = useDispatch()
  const [pdfInfo, setPdfInfo] = useState(null)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      questions: [],
      universityTags: [],
      semesterTags: []
    },
    validationSchema: createTopicSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          contentType: pdfInfo ? 'pdf' : 'text',
          content: pdfInfo ? '' : '',
          pdf_url: pdfInfo?.pdfUrl || '',
          pdf_key: pdfInfo?.pdfKey || '',
          pdf_filename: pdfInfo?.pdfFilename || '',
          tags: allTags.map(t => t.id),
          questions: values.questions.map((q, index) => ({
            question: q.question,
            answer: q.answer,
            explanation: q.explanation,
            order: index
          }))
        }

        await dispatch(createExerciseTopic(payload))

        // Refresh the list
        await dispatch(fetchAdminExerciseTopics())

        // Reset form and clear generated content
        resetForm()
        setPdfInfo(null)

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

  return {
    form,
    sensors,
    handleAddQuestion,
    handleRemoveQuestion,
    handleDragEnd,
    setPdfInfo
  }
}
