import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateSummaryNote,
  generateSummaryFromDocument,
  fetchAdminSummaryNotes,
  uploadDocument
} from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { blocksToMarkdown } from '@utils/blocksToMarkdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { clearGeneratedContent, setError, clearError, setLoading } = actions

export const useUpdateNote = (onClose) => {
  const dispatch = useDispatch()
  const { generatedContent, selectedNote } = useSelector(state => state.summaryNotes)
  const [uploadedFile, setUploadedFile] = useState(null)
  const [blobId, setBlobId] = useState(null)
  const [sourceFileInfo, setSourceFileInfo] = useState(null)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: null,
      status: 'draft',
      universityTags: [],
      semesterTags: []
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
      if (!selectedNote) return

      try {
        dispatch(clearError())

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
        const markdownContent = blocksToMarkdown(values.content)

        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content: contentString,
          markdownContent: markdownContent,
          status: apiStatus,
          isActive: isActive,
          tagIds: allTags.map(t => t.id),
          blobId: blobId || null
        }

        await dispatch(updateSummaryNote(selectedNote.id, payload))

        // Refresh the list
        await dispatch(fetchAdminSummaryNotes({}, 1, 30))

        // Clear generated content
        dispatch(clearGeneratedContent())

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        dispatch(setError('Gagal update ringkasan. Silakan coba lagi.'))
      }
    }
  })

  // Initialize form with existing note data
  useEffect(() => {
    if (selectedNote) {
      // Determine status based on is_active and status
      let combinedStatus = selectedNote.status || 'draft'
      if (selectedNote.is_active === false) {
        combinedStatus = 'inactive'
      }

      // Parse content - handle both JSON blocks and markdown (legacy)
      let parsedContent = null
      if (selectedNote.content) {
        try {
          // Try to parse as JSON first
          const parsed = JSON.parse(selectedNote.content)
          parsedContent = Array.isArray(parsed) ? parsed : null
        } catch (e) {
          // If not JSON, convert markdown to blocks
          parsedContent = [{
            type: "paragraph",
            content: selectedNote.content
          }]
        }
      }

      // Backend already separates tags - just use them directly
      const universityTags = selectedNote.universityTags || []
      const semesterTags = selectedNote.semesterTags || []

      form.setValues({
        title: selectedNote.title || '',
        description: selectedNote.description || '',
        content: parsedContent,
        status: combinedStatus,
        universityTags: universityTags,
        semesterTags: semesterTags
      })

      // Set blobId and source file info if exists
      if (selectedNote.blobId) {
        setBlobId(selectedNote.blobId)
        setSourceFileInfo({
          blobId: selectedNote.blobId,
          url: selectedNote.sourceUrl,
          filename: selectedNote.sourceFilename,
          type: selectedNote.sourceContentType
        })
      } else {
        setBlobId(null)
        setSourceFileInfo(null)
      }
    }
  }, [selectedNote])

  // Handle AI-generated content
  useEffect(() => {
    if (generatedContent?.summary) {
      // Convert generated markdown to BlockNote blocks
      const blocks = markdownToBlocks(generatedContent.summary)
      form.setFieldValue('content', blocks)

      // blobId is already set from the upload, no need to update it from generatedContent
    }
  }, [generatedContent])

  const handleFileSelect = async (e) => {
    const file = e.target.files[0]
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
        dispatch(setLoading({ key: 'isUploading', value: true }))
        dispatch(clearError())

        // Upload file immediately to get blobId
        const result = await dispatch(uploadDocument(file))

        setBlobId(result.blobId)
        setUploadedFile({
          name: result.fileName || file.name, // Backend returns fileName (camelCase)
          type: file.type, // Get from original file object (backend doesn't return contentType)
          size: result.byteSize,
          url: result.url // For viewing the uploaded file
        })
      } catch (error) {
        console.error('Failed to upload file:', error)
        dispatch(setError('Gagal upload file. Silakan coba lagi.'))
      } finally {
        dispatch(setLoading({ key: 'isUploading', value: false }))
      }
    }
  }

  const handleGenerate = async () => {
    if (!blobId) {
      dispatch(setError('Pilih file terlebih dahulu.'))
      return
    }

    try {
      dispatch(clearError())
      await dispatch(generateSummaryFromDocument(blobId))
    } catch (err) {
      dispatch(setError('Gagal generate ringkasan. Silakan coba lagi.'))
    }
  }

  const handleRemoveFile = () => {
    setBlobId(null)
    setUploadedFile(null)
    dispatch(clearGeneratedContent())
  }

  const handleRemoveSourceFile = () => {
    setBlobId(null)
    setSourceFileInfo(null)
    setUploadedFile(null)
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
      const result = await dispatch(uploadDocument(file))

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
    handleImageUpload,
    uploadedFile,
    sourceFileInfo
  }
}
