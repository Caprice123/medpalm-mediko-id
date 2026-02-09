import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateSummaryNote,
  generateSummaryFromDocument,
  fetchAdminSummaryNotes
} from '@store/summaryNotes/action'
import { upload } from '@store/common/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { blocksToMarkdown } from '@utils/blocksToMarkdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { setError } = actions

export const useUpdateNote = (onClose) => {
  const dispatch = useDispatch()
  const { detail } = useSelector(state => state.summaryNotes)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: null,
      status: 'draft',
      universityTags: [],
      semesterTags: [],
      topicTags: [],
      departmentTags: [],
      // File upload state merged into Formik
      uploadedFile: null,
      blobId: null,
      sourceFileInfo: null,
      // Linked resources
      selectedFlashcards: [],
      selectedMcqTopics: []
    },
    validate: (values) => {
      const errors = {}

      if (!values.title || !values.title.trim()) {
        errors.title = 'Judul harus diisi'
      }

      if (!values.content || values.content.length === 0) {
        errors.content = 'Konten harus diisi'
      }

      return errors
    },
    onSubmit: async (values) => {
      if (!detail) return
      // Convert combined status to status + isActive
      let apiStatus = values.status
      let isActive = true

      if (values.status === 'inactive') {
          apiStatus = 'draft'
          isActive = false
      }

      // Stringify the blocks for storage
      const contentString = JSON.stringify(values.content)

      // Convert blocks to markdown
      const markdownContent = await blocksToMarkdown(values.content)

      // Combine all tags from different groups
      const allTags = [
        ...values.universityTags,
        ...values.semesterTags,
        ...values.topicTags,
        ...values.departmentTags
      ]

      const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content: contentString,
          markdownContent: markdownContent,
          status: apiStatus,
          isActive: isActive,
          tagIds: allTags.map(t => t.id),
          blobId: values.blobId || null,
          flashcardDeckIds: values.selectedFlashcards.map(f => f.id),
          mcqTopicIds: values.selectedMcqTopics.map(m => m.id)
      }

      await dispatch(updateSummaryNote(detail.id, payload))

      // Refresh the list
      await dispatch(fetchAdminSummaryNotes())

      // Close modal
      if (onClose) {
        onClose()
      }
    }
  })

  // Initialize form with existing note data
  useEffect(() => {
    if (detail) {
      // Determine status based on is_active and status
      let combinedStatus = detail.status || 'draft'
      if (detail.is_active === false) {
        combinedStatus = 'inactive'
      }

      // Parse content - handle both JSON blocks and markdown (legacy)
      let parsedContent = null
      if (detail.content) {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(detail.content)
          parsedContent = Array.isArray(parsed) ? parsed : null
        } catch (e) {
          // If not JSON, convert markdown to blocks
          parsedContent = [{
            type: "paragraph",
            content: detail.content
          }]
        }
      }

      // Backend already separates tags - just use them directly
      const universityTags = detail.universityTags || []
      const semesterTags = detail.semesterTags || []
      const topicTags = detail.topicTags || []
      const departmentTags = detail.departmentTags || []

      const formValues = {
        title: detail.title || '',
        description: detail.description || '',
        content: parsedContent,
        status: combinedStatus,
        universityTags: universityTags,
        semesterTags: semesterTags,
        topicTags: topicTags,
        departmentTags: departmentTags,
        uploadedFile: null,
        blobId: null,
        sourceFileInfo: null,
        selectedFlashcards: detail.flashcardDecks || [],
        selectedMcqTopics: detail.mcqTopics || []
      }

      // Set blobId and source file info if exists
      if (detail.blob) {
        formValues.blobId = detail.blob.id
        formValues.sourceFileInfo = {
          blobId: detail.blob.id,
          url: detail.blob.url,
          filename: detail.blob.filename,
          type: detail.blob.contentType,
          size: detail.blob.byteSize
        }
      }

      form.setValues(formValues)
    }
  }, [detail])

  const handleFileSelect = async (file) => {
    if (file) {
      const allowedTypes = [
        'application/pdf',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-powerpoint',
        'application/msword'
      ]

      if (!allowedTypes.includes(file.type)) {
        dispatch(setError('Format file tidak didukung. Gunakan PDF, PPTX, atau DOCX.'))
        return
      }

      if (file.size > 50 * 1024 * 1024) {
        dispatch(setError('Ukuran file maksimal 50MB.'))
        return
      }

      try {
        // Upload file immediately to get blobId
        const result = await dispatch(upload(file, 'summary-notes'))

        form.setFieldValue('blobId', result.blobId)
        form.setFieldValue('uploadedFile', {
          name: result.filename || file.name,
          type: result.contentType || file.type,
          size: result.byteSize,
          url: result.url // For viewing the uploaded file
        })
      } catch (error) {
        console.error('Failed to upload file:', error)
        dispatch(setError('Gagal upload file. Silakan coba lagi.'))
      }
    }
  }

  const handleGenerate = async () => {
    if (!form.values.blobId) {
      dispatch(setError('Pilih file terlebih dahulu.'))
      return
    }

    const result = await dispatch(generateSummaryFromDocument(form.values.blobId))
    const blocks = await markdownToBlocks(result.summary)
    form.setFieldValue('content', blocks)
  }

  const handleRemoveFile = () => {
    form.setFieldValue('blobId', null)
    form.setFieldValue('uploadedFile', null)
  }

  const handleRemoveSourceFile = () => {
    form.setFieldValue('blobId', null)
    form.setFieldValue('sourceFileInfo', null)
    form.setFieldValue('uploadedFile', null)
  }

  const handleImageUpload = async (file) => {
    try {
      // Validate file type (images only)
      const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
      if (!allowedImageTypes.includes(file.type)) {
        throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
      }

      // Validate file size (max 10MB for images)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('Ukuran gambar maksimal 10MB.')
      }

      // Upload image to blob storage
      const result = await dispatch(upload(file, 'summary-notes'))

      // Return permanent blob URL (never expires, generates fresh presigned URL on each request)
      return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
    } catch (error) {
      console.error('Failed to upload image:', error)
      dispatch(setError(error.message || 'Gagal upload gambar.'))
      throw error
    }
  }

  return {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    handleRemoveSourceFile,
    handleImageUpload
  }
}
