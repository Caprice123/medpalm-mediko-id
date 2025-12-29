import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef, useEffect } from 'react'
import { updateMcqTopic, fetchAdminMcqTopics } from '@store/mcq/action'
import { upload } from '@store/common/action'

export const useUpdateTopic = (closeCallback) => {
  const dispatch = useDispatch()
  const { selectedTopic } = useSelector(state => state.mcq)
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      contentType: 'manual',
      quiz_time_limit: 0,
      passing_score: 70,
      universityTags: [],
      semesterTags: [],
      questions: [],
      status: 'draft'
    },
    onSubmit: (values, { resetForm }) => {
      // Merge university and semester tags into single tags array
      const topicData = {
        ...values,
        tags: [...values.universityTags, ...values.semesterTags]
      }
      // Remove separate tag fields before submission
      delete topicData.universityTags
      delete topicData.semesterTags

      dispatch(updateMcqTopic(selectedTopic.id, topicData, () => {
        dispatch(fetchAdminMcqTopics())
        resetForm()
        if (closeCallback) closeCallback()
      }))
    }
  })

  // Load selected topic data when component mounts or selectedTopic changes
  useEffect(() => {
    if (selectedTopic) {
      form.setValues({
        title: selectedTopic.title || '',
        description: selectedTopic.description || '',
        contentType: selectedTopic.contentType || 'manual',
        quiz_time_limit: selectedTopic.quiz_time_limit || 0,
        passing_score: selectedTopic.passing_score || 70,
        universityTags: selectedTopic.universityTags || [],
        semesterTags: selectedTopic.semesterTags || [],
        questions: selectedTopic.questions || [],
        status: selectedTopic.status || 'draft'
      })
    }
  }, [selectedTopic])

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
        question: '',
        image_url: '',
        image_key: '',
        image_filename: '',
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
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }

  const handleQuestionImageSelect = async (e, questionIndex) => {
    const file = e.target.files[0]
    if (!file) return

    try {
      const result = await dispatch(upload(file, 'exercise'))
      form.setFieldValue(`questions.${questionIndex}.imageUrl`, result.url)
      form.setFieldValue(`questions.${questionIndex}.imageKey`, result.key)
      form.setFieldValue(`questions.${questionIndex}.imageFilename`, result.filename)
    } catch (error) {
      console.error('Failed to upload question image:', error)
    }
  }

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
  }
}
