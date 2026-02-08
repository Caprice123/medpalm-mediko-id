import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { useState, useCallback, useRef, useMemo } from 'react'
import {
    fetchAdminAnatomyQuizzes,
    updateAnatomyQuiz,
} from '@store/anatomy/adminAction'
import { useUploadAttachment } from './useUploadAttachment'

export const useUpdateQuiz = (closeCallback) => {
  const dispatch = useDispatch()
  const [showConfirmClose, setShowConfirmClose] = useState(false)
  const initialFormData = useRef(null)
  const { detail: selectedQuiz } = useSelector(state => state.anatomy)
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
      blob: selectedQuiz?.blob || {
        id: null,
        url: '',
        filename: '',
        size: null
      },
      universityTags: initialUniversityTags,
      semesterTags: initialSemesterTags,
      questions: (selectedQuiz?.questions || []).map(q => {
        // Initialize correctChoiceIndex based on the answer if it's multiple choice
        let correctChoiceIndex = q.correctChoiceIndex
        if (q.answerType === 'multiple_choice' && q.choices && !correctChoiceIndex && correctChoiceIndex !== 0) {
          correctChoiceIndex = q.choices.findIndex(c => c === q.answer)
          if (correctChoiceIndex === -1) correctChoiceIndex = null
        }
        return {
          ...q,
          correctChoiceIndex
        }
      }),
      status: selectedQuiz?.status || 'draft'
    },
    onSubmit: (values, { resetForm }) => {
      // Prepare quiz data with blobId
      const quizData = {
        title: values.title,
        description: values.description,
        blobId: values.blob.id,
        tags: [...values.universityTags, ...values.semesterTags].map(tag => tag.id),
        questions: values.questions.map((q, index) => ({
          ...(q.id && { id: q.id }),
          question: q.question,
          answer: q.answer,
          answerType: q.answerType || 'text',
          choices: q.choices || null,
          order: index
        })),
        status: values.status
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
        dispatch(fetchAdminAnatomyQuizzes())
      }

      dispatch(updateAnatomyQuiz(selectedQuiz.uniqueId, quizData, onSuccess))
    }
  })

  const { form: uploadImageForm } = useUploadAttachment((imageInfo) => {
    form.setFieldValue('blob', {
      id: imageInfo.blobId,
      url: imageInfo.imageUrl,
      filename: imageInfo.fileName || 'File name',
      size: imageInfo.fileSize || null
    })
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
        answerType: 'text',
        choices: ['', ''],
        correctChoiceIndex: null,
        tempId: Date.now()
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
    onClose,
    onChange: form.handleChange,
    handleConfirmClose,
    handleCancelClose,
    handleAddQuestion,
    handleRemoveQuestion,
    handleAddOption,
    handleRemoveOption,
    handleImageSelect,
  }
}
