import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef, useMemo } from 'react'
import {
  updateAnatomyQuiz,
} from '@store/anatomy/action'
import { useUploadAttachment } from './useUploadAttachment'

export const useUpdateQuiz = (closeCallback) => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const initialFormData = useRef(null)
  const { selectedQuiz } = useSelector(state => state.anatomy)
  const { tags } = useSelector(state => state.tags)

  // Get university and semester tags from Redux
  const universityTags = useMemo(() =>
    tags.find(t => t.name === 'university')?.tags || [],
    [tags]
  )
  const semesterTags = useMemo(() =>
    tags.find(t => t.name === 'semester')?.tags || [],
    [tags]
  )

  // Split quiz tags into university and semester when quiz is provided
  const initialUniversityTags = useMemo(() => {
    if (!selectedQuiz?.tags) return []
    return selectedQuiz.tags.filter(tag =>
      universityTags.find(ut => ut.id === tag.id)
    )
  }, [selectedQuiz, universityTags])

  const initialSemesterTags = useMemo(() => {
    if (!selectedQuiz?.tags) return []
    return selectedQuiz.tags.filter(tag =>
      semesterTags.find(st => st.id === tag.id)
    )
  }, [selectedQuiz, semesterTags])

  const form = useFormik({
    enableReinitialize: true,
    initialValues: {
      title: selectedQuiz?.title || '',
      description: selectedQuiz?.description || '',
      image_url: selectedQuiz?.image_url || '',
      image_key: selectedQuiz?.image_key || '',
      image_filename: selectedQuiz?.image_filename || '',
      universityTags: initialUniversityTags,
      semesterTags: initialSemesterTags,
      questions: selectedQuiz?.questions || [],
      status: selectedQuiz?.status || 'draft'
    },
    onSubmit: (values) => {
      // Merge university and semester tags into single tags array
      const quizData = {
        ...values,
        tags: [...values.universityTags, ...values.semesterTags].map(tag => tag.id),
        questions: values.questions.map((q, index) => ({
          ...(q.id && { id: q.id }),
          question: q.question,
          answer: q.answer,
          order: index
        }))
      }
      // Remove separate tag fields before submission
      delete quizData.universityTags
      delete quizData.semesterTags

      dispatch(updateAnatomyQuiz(selectedQuiz.id, quizData))
    }
  })

  const { form: uploadImageForm } = useUploadAttachment((imageInfo) => {
    form.setFieldValue('image_url', imageInfo.image_url)
    form.setFieldValue('image_key', imageInfo.image_key)
    form.setFieldValue('image_filename', imageInfo.image_filename)
  })

  const hasUnsavedChanges = useCallback(() => {
    if (!initialFormData.current) return false
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
        tempId: Date.now()
      }
    ])
  }

  const handleRemoveQuestion = (index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (!file) return

    uploadImageForm.setFieldValue('file', file)
    uploadImageForm.handleSubmit()
  }

  return {
    form,
    showConfirmClose,
    onClose,
    onChange: form.handleChange,
    handleConfirmClose,
    handleCancelClose,
    handleAddQuestion,
    handleRemoveQuestion,
    handleImageSelect,
  }
}
