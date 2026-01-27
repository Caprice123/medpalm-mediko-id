import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import {
  createSummaryNote,
  generateSummaryFromDocument,
  fetchAdminSummaryNotes
} from '@store/summaryNotes/action'
import { upload } from '@store/common/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { blocksToMarkdown } from '@utils/blocksToMarkdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { setError } = actions

export const useCreateNote = (onClose) => {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: null,
      status: 'draft',
      universityTags: [],
      semesterTags: [],
      // File upload state merged into Formik
      uploadedFile: null,
      blobId: null
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
        // Stringify the blocks for storage
        const contentString = JSON.stringify(values.content)

        // Convert blocks to markdown
        const markdownContent = await blocksToMarkdown(values.content)

        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content: contentString,
          markdownContent: markdownContent,
          status: values.status,
          isActive: true,
          tagIds: allTags.map(t => t.id),
          blobId: values.blobId || null
        }

        await dispatch(createSummaryNote(payload))

        // Refresh the list
        await dispatch(fetchAdminSummaryNotes({}, 1, 30))

        // Reset form and clear generated content
        form.resetForm()

        // Close modal
        if (onClose) {
          onClose()
        }
    }
  })

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

      // Upload file immediately to get blobId
      const result = await dispatch(upload(file, 'summary-notes'))

      form.setFieldValue('blobId', result.blobId)
      const fileInfo = {
          name: result.filename || file.name,
          type: result.contentType || file.type,
          size: result.byteSize,
          url: result.url // For viewing the uploaded file
      }
      form.setFieldValue('uploadedFile', fileInfo)
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

  const handleImageUpload = async (file) => {
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
  }

  return {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    handleImageUpload
  }
}
