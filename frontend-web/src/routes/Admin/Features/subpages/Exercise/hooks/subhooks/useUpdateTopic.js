import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateTopicQuestions,
  fetchAdminExerciseTopics
} from '@store/exercise/adminAction'
import { KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable'
import { updateTopicSchema } from '../../validationSchema/exerciseTopicSchema'

export const useUpdateTopic = (topicToEdit, onClose) => {
  const dispatch = useDispatch()
  const [pdfInfo, setPdfInfo] = useState(null)
  const [initialContentType, setInitialContentType] = useState('text')
  const [initialTextContent, setInitialTextContent] = useState('')

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      questions: [],
      universityTags: [],
      semesterTags: []
    },
    validationSchema: updateTopicSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        if (!topicToEdit?.id) {
          console.error('No topic selected for update')
          return
        }

        // For update, we only update questions
        // Title, tags, and other metadata are not updated in the current implementation
        const questionsData = values.questions.map((question, index) => ({
          question: question.question,
          answer: question.answer,
          explanation: question.explanation,
          order: index
        }))

        await dispatch(updateTopicQuestions(topicToEdit.id, questionsData))

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
        tag.tag_group?.name === 'university'
      ) || []

      const semesterTags = topicToEdit.tags?.filter(tag =>
        tag.tag_group?.name === 'semester'
      ) || []

      // Add id to questions for drag-and-drop
      const questionsWithIds = topicToEdit.questions?.map((question, index) => ({
        ...question,
        id: question.id || Date.now() + index
      })) || []

      form.setValues({
        title: topicToEdit.title || '',
        description: topicToEdit.description || '',
        questions: questionsWithIds,
        universityTags: universityTags,
        semesterTags: semesterTags
      })

      // Set initial content based on content_type
      if (topicToEdit.content_type === 'pdf' || topicToEdit.type === 'pdf') {
        setInitialContentType('pdf')
        if (topicToEdit.pdf_url) {
          setPdfInfo({
            pdf_url: topicToEdit.pdf_url,
            pdf_key: topicToEdit.pdf_key,
            pdf_filename: topicToEdit.pdf_filename
          })
        }
      } else if (topicToEdit.content) {
        setInitialContentType('text')
        setInitialTextContent(topicToEdit.content)
      } else {
        // Default to text if no content_type
        setInitialContentType('text')
        setInitialTextContent('')
      }
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

  return {
    form,
    sensors,
    handleAddQuestion,
    handleRemoveQuestion,
    handleDragEnd,
    setPdfInfo,
    pdfInfo,
    initialContentType,
    initialTextContent
  }
}
