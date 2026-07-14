import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import { updateSummaryNoteV2, generateSummaryFromDocumentV2, fetchAdminSummaryNoteDetailV2 } from '@store/summaryNotes/v2/adminAction'
import { upload } from '@store/common/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { blocksToMarkdown } from '@utils/blocksToMarkdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { setError } = actions

export const useUpdateNoteV2 = (onClose) => {
  const dispatch = useDispatch()
  const { detail } = useSelector(state => state.summaryNotesV2)

  const form = useFormik({
    initialValues: {
      title: '',
      description: '',
      content: null,
      status: 'draft',
      universityTags: [],
      semesterTags: [],
      departmentTags: [],
      uploadedFile: null,
      blobId: null,
      sourceFileInfo: null,
      selectedFlashcards: [],
      selectedMcqTopics: []
    },
    validate: (values) => {
      const errors = {}
      if (!values.title || !values.title.trim()) {
        errors.title = 'Judul harus diisi'
      }
      return errors
    },
    onSubmit: async (values) => {
      if (!detail) return

      const allTags = [
        ...values.universityTags,
        ...values.semesterTags,
        ...values.departmentTags
      ]

      let contentString
      let markdownContent
      if (values.content && values.content.length > 0) {
        contentString = JSON.stringify(values.content)
        markdownContent = await blocksToMarkdown(values.content)
      }

      const payload = {
        title: values.title.trim(),
        description: values.description.trim(),
        ...(contentString !== undefined && { content: contentString, markdownContent }),
        status: values.status,
        tagIds: allTags.map(t => t.id),
        blobId: values.blobId || null,
        flashcardDeckIds: values.selectedFlashcards.map(f => f.id),
        mcqTopicIds: values.selectedMcqTopics.map(m => m.id)
      }

      await dispatch(updateSummaryNoteV2(detail.uniqueId, payload))
      await dispatch(fetchAdminSummaryNoteDetailV2(detail.uniqueId))

      if (onClose) onClose()
    }
  })

  useEffect(() => {
    if (detail) {
      let parsedContent = null
      if (detail.content) {
        try {
          const parsed = JSON.parse(detail.content)
          parsedContent = Array.isArray(parsed) ? parsed : null
        } catch {
          parsedContent = [{ type: 'paragraph', content: detail.content }]
        }
      }

      const formValues = {
        title: detail.title || '',
        description: detail.description || '',
        content: parsedContent,
        status: detail.status || 'draft',
        universityTags: detail.universityTags || [],
        semesterTags: detail.semesterTags || [],
        departmentTags: detail.departmentTags || [],
        uploadedFile: null,
        blobId: null,
        sourceFileInfo: null,
        selectedFlashcards: detail.flashcardDecks || [],
        selectedMcqTopics: detail.mcqTopics || []
      }

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
    if (!file) return
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
      const result = await dispatch(upload(file, 'summary-notes'))
      form.setFieldValue('blobId', result.blobId)
      form.setFieldValue('uploadedFile', {
        name: result.filename || file.name,
        type: result.contentType || file.type,
        size: result.byteSize,
        url: result.url
      })
    } catch {
      dispatch(setError('Gagal upload file. Silakan coba lagi.'))
    }
  }

  const handleGenerate = async () => {
    if (!form.values.blobId) {
      dispatch(setError('Pilih file terlebih dahulu.'))
      return
    }
    const result = await dispatch(generateSummaryFromDocumentV2(form.values.blobId))
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
    const allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    if (!allowedImageTypes.includes(file.type)) {
      throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, GIF, atau WebP.')
    }
    if (file.size > 10 * 1024 * 1024) {
      throw new Error('Ukuran gambar maksimal 10MB.')
    }
    const result = await dispatch(upload(file, 'summary-notes'))
    return `${API_BASE_URL}/api/v1/blobs/${result.blobId}`
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
