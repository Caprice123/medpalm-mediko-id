import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef } from 'react'
import {
  createAnatomyQuiz,
} from '@store/anatomy/action'
import { useUploadAttachment } from './useUploadAttachment'

export const useCreateQuiz = () => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      image_url: '',
      image_key: '',
      image_filename: '',
      universityTags: [],
      semesterTags: [],
      questions: [],
      status: 'draft'
    },
    onSubmit: (values) => {
      // Merge university and semester tags into single tags array
      const quizData = {
        ...values,
        tags: [...values.universityTags, ...values.semesterTags]
      }
      // Remove separate tag fields before submission
      delete quizData.universityTags
      delete quizData.semesterTags

      dispatch(createAnatomyQuiz(quizData))
    }
  })

  const initialFormData = useRef(JSON.stringify(form.initialValues))

  const { form: uploadImageForm } = useUploadAttachment((imageInfo) => {
    form.setFieldValue('image_url', imageInfo.image_url)
    form.setFieldValue('image_key', imageInfo.image_key)
    form.setFieldValue('image_filename', imageInfo.image_filename)
  })

  const hasUnsavedChanges = useCallback(() => {
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

  const handleAddQuestion = () => {
    form.setFieldValue('questions', [
      ...form.values.questions,
      {
        label: '',
        answer: '',
        explanation: '',
      }
    ])
  }

  const handleRemoveQuestion = (index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    await uploadImageForm.setFieldValue('file', file)
    uploadImageForm.handleSubmit()
  }

  return {
    form,
    onChange: form.handleChange,
    onClose,
    showConfirmClose,
    handleConfirmClose,
    handleCancelClose,
    handleAddQuestion,
    handleRemoveQuestion,
    handleImageSelect,
  }
}