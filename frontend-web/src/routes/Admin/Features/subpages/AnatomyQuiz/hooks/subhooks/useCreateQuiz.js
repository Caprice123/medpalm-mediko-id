import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef } from 'react'
import {
  createAnatomyQuiz,
  fetchAdminAnatomyQuizzes,
} from '@store/anatomy/adminAction'
import { useUploadAttachment } from './useUploadAttachment'

export const useCreateQuiz = (closeCallback) => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      mediaType: 'upload', // 'upload' | 'embed'
      blob: {
        id: null,
        url: '',
        filename: '',
        size: null
      },
      embedUrl: '',
      questionCount: '',
      universityTags: [],
      semesterTags: [],
      questions: [],
      status: 'draft'
    },
    onSubmit: (values, { resetForm }) => {
      // Prepare quiz data with blobId or embedUrl
      const quizData = {
        title: values.title,
        description: values.description,
        blobId: values.mediaType === 'upload' ? values.blob.id : null,
        embedUrl: values.mediaType === 'embed' ? values.embedUrl : null,
        questionCount: values.mediaType === 'embed' ? (parseInt(values.questionCount) || 0) : undefined,
        tags: [...values.universityTags, ...values.semesterTags].map(tag => tag.id),
        questions: values.questions,
        status: values.status
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
        dispatch(fetchAdminAnatomyQuizzes())
      }

      dispatch(createAnatomyQuiz(quizData, onSuccess))
    }
  })

  const initialFormData = useRef(JSON.stringify(form.initialValues))

  const { form: uploadImageForm } = useUploadAttachment((imageInfo) => {
    form.setFieldValue('blob', {
      id: imageInfo.blobId,
      url: imageInfo.imageUrl,
      filename: imageInfo.fileName || 'File name',
      size: imageInfo.fileSize || null
    })
  })

  const hasUnsavedChanges = useCallback(() => {
    return JSON.stringify(form.values) !== initialFormData.current
  }, [form.values])

  const onClose = () => {
    if (hasUnsavedChanges()) {
      setShowConfirmClose(true)
      // Store the callback to call after confirmation
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
        answer: '',
        answerType: 'text',
        choices: ['', ''],
        correctChoiceIndex: null
      }
    ])
  }

  const handleRemoveQuestion = (index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }

  const handleAddOption = (questionIndex) => {
    const currentChoices = form.values.questions[questionIndex].choices || []
    form.setFieldValue(`questions.${questionIndex}.choices`, [...currentChoices, ''])
  }

  const handleRemoveOption = (questionIndex, optionIndex) => {
    const currentChoices = form.values.questions[questionIndex].choices || []
    const currentCorrectIndex = form.values.questions[questionIndex].correctChoiceIndex

    if (currentChoices.length <= 2) return // Don't allow removing if only 2 options left

    const newChoices = currentChoices.filter((_, i) => i !== optionIndex)
    form.setFieldValue(`questions.${questionIndex}.choices`, newChoices)

    // Update correctChoiceIndex if needed
    if (currentCorrectIndex === optionIndex) {
      // If we removed the selected option, clear the selection
      form.setFieldValue(`questions.${questionIndex}.correctChoiceIndex`, null)
      form.setFieldValue(`questions.${questionIndex}.answer`, '')
    } else if (currentCorrectIndex > optionIndex) {
      // If we removed an option before the selected one, decrease the index
      form.setFieldValue(`questions.${questionIndex}.correctChoiceIndex`, currentCorrectIndex - 1)
    }
  }

  const handleImageSelect = async (file) => {
    if (!file) return

    await uploadImageForm.setFieldValue('file', file)
    await uploadImageForm.submitForm()
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
    handleImageSelect,
  }
}