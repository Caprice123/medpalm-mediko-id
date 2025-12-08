import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef, useEffect } from 'react'
import {
  updateAnatomyQuiz,
} from '@store/anatomy/action'
import { useUploadAttachment } from './useUploadAttachment'

export const useUpdateQuiz = (setUiState, quiz) => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const initialFormData = useRef(null)

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: '',
      description: '',
      image_url: '',
      image_key: '',
      image_filename: '',
      tags: [],
      questions: [],
      status: 'draft'
    },
    onSubmit: (values) => {
      const quizData = {
        ...values,
        tags: values.tags.map(tag => tag.id),
        questions: values.questions.map((q, index) => ({
          ...(q.id && { id: q.id }),
          label: q.label,
          answer: q.answer,
          explanation: q.explanation,
          order: index
        }))
      }
      dispatch(updateAnatomyQuiz(quiz.id, quizData))
    }
  })

  const { form: uploadImageForm } = useUploadAttachment((imageInfo) => {
    form.setFieldValue('image_url', imageInfo.image_url)
    form.setFieldValue('image_key', imageInfo.image_key)
    form.setFieldValue('image_filename', imageInfo.image_filename)
  })

  const onOpen = useCallback(async (quiz) => {
    setUiState(prev => ({ ...prev, isCalculatorModalOpen: true, mode: "edit" }))
    form.setValues({
        ...quiz,
    })
    // Store initial form data for comparison
    setTimeout(() => {
      initialFormData.current = JSON.stringify(form.values)
    }, 0)
  }, [setUiState, form])

  const hasUnsavedChanges = useCallback(() => {
    if (!initialFormData.current) return false
    return JSON.stringify(form.values) !== initialFormData.current
  }, [form.values])

  const onClose = useCallback((closeCallback) => {
    if (hasUnsavedChanges()) {
      setShowConfirmClose(true)
      // Store the callback to call after confirmation
      onClose.closeCallback = closeCallback
    } else {
      if (closeCallback) closeCallback()
    }
  }, [hasUnsavedChanges])

  const handleConfirmClose = useCallback(() => {
    setShowConfirmClose(false)
    if (onClose.closeCallback) {
      onClose.closeCallback()
      onClose.closeCallback = null
    }
  }, [])

  const handleCancelClose = useCallback(() => {
    setShowConfirmClose(false)
    onClose.closeCallback = null
  }, [])

  const handleAddQuestion = useCallback(() => {
    form.setFieldValue('questions', [
      ...form.values.questions,
      {
        label: '',
        answer: '',
        explanation: '',
        tempId: Date.now()
      }
    ])
  }, [form])

  const handleRemoveQuestion = useCallback((index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }, [form])

  const handleImageSelect = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    uploadImageForm.setFieldValue('file', file)
    uploadImageForm.handleSubmit()
  }, [uploadImageForm])

  return {
    form,
    onOpen,
    onClose,
    showConfirmClose,
    handleConfirmClose,
    handleCancelClose,
    handleAddQuestion,
    handleRemoveQuestion,
    handleImageSelect,
  }
}
