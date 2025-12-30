import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef } from 'react'
import {
  createAnatomyQuiz,
} from '@store/anatomy/adminAction'
import { useUploadAttachment } from './useUploadAttachment'

export const useCreateQuiz = (closeCallback) => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      blob: {
        id: null,
        url: '',
        filename: '',
        size: null
      },
      universityTags: [],
      semesterTags: [],
      questions: [],
      status: 'draft'
    },
    onSubmit: (values, { resetForm }) => {
      // Prepare quiz data with blobId
      const quizData = {
        title: values.title,
        description: values.description,
        blobId: values.blob.id,
        tags: [...values.universityTags, ...values.semesterTags].map(tag => tag.id),
        questions: values.questions,
        status: values.status
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
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
      }
    ])
  }

  const handleRemoveQuestion = (index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
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
    handleImageSelect,
  }
}