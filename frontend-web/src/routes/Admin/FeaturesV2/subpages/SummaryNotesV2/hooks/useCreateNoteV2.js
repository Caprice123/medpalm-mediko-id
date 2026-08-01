import { useDispatch } from 'react-redux'
import { useFormik } from 'formik'
import { createSummaryNoteV2, generateSummaryFromDocumentV2 } from '@store/summaryNotes/v2/adminAction'
import { upload } from '@store/common/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'
import { blocksToMarkdown } from '@utils/blocksToMarkdown'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const { setError } = actions

export function useCreateNoteV2(nodeId, nodeName, onClose) {
  const dispatch = useDispatch()

  const form = useFormik({
    initialValues: {
      title: nodeName || '',
      description: '',
      content: null,
      uploadedFile: null,
      blobId: null,
    },
    validate: (values) => {
      const errors = {}
      if (!nodeId && !values.title?.trim()) errors.title = 'Judul harus diisi'
      return errors
    },
    onSubmit: async (values) => {
      let contentString = JSON.stringify([])
      let markdownContent = ''
      if (values.content && values.content.length > 0) {
        contentString = JSON.stringify(values.content)
        markdownContent = await blocksToMarkdown(values.content)
      }

      const note = await dispatch(createSummaryNoteV2({
        title: values.title.trim(),
        description: values.description.trim(),
        content: contentString,
        markdownContent,
        status: 'published',
        isActive: true,
        blobId: values.blobId || null,
        nodeId: nodeId || null,
      }))

      onClose(note)
    },
  })

  const handleFileSelect = async (file) => {
    if (!file) return
    const allowedTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-powerpoint',
      'application/msword',
    ]
    if (!allowedTypes.includes(file.type)) {
      dispatch(setError('Format file tidak didukung. Gunakan PDF, PPTX, atau DOCX.'))
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      dispatch(setError('Ukuran file maksimal 50MB.'))
      return
    }
    const result = await dispatch(upload(file, 'summary-notes'))
    form.setFieldValue('blobId', result.blobId)
    form.setFieldValue('uploadedFile', {
      name: result.filename || file.name,
      type: result.contentType || file.type,
      size: result.byteSize,
      url: result.url,
    })
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

  return { form, handleFileSelect, handleGenerate, handleRemoveFile, handleImageUpload }
}
