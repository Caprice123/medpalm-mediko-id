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
      questions: selectedQuiz?.questions || [],
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
          order: index
        })),
        status: values.status
      }

      const onSuccess = () => {
        resetForm()
        if (closeCallback) closeCallback()
        dispatch(fetchAdminAnatomyQuizzes())
      }

      dispatch(updateAnatomyQuiz(selectedQuiz.id, quizData, onSuccess))
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
        tempId: Date.now()
      }
    ])
  }

  const handleRemoveQuestion = (index) => {
    form.setFieldValue('questions', form.values.questions.filter((_, i) => i !== index))
  }

  const handleImageSelect = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    console.log('File selected:', file.name, file.size, file.type)

    try {
      await uploadImageForm.setFieldValue('file', file)
      console.log('File value set, submitting...')
      await uploadImageForm.submitForm()
      console.log('Upload submitted')
    } catch (error) {
      console.error('Upload error:', error)
    }

    // Reset file input to allow re-uploading the same file
    e.target.value = ''
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
