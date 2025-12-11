import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  createSummaryNote,
  generateSummaryFromDocument,
  fetchAdminSummaryNotes
} from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'

const { clearGeneratedContent, setError, clearError } = actions

export const useCreateNote = (onClose) => {
  const dispatch = useDispatch()
  const { generatedContent } = useSelector(state => state.summaryNotes)
  const [uploadedFile, setUploadedFile] = useState(null)
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
      try {
        dispatch(clearError())

        // Stringify the blocks for storage
        const contentString = JSON.stringify(values.content)

        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content: contentString,
          status: values.status,
          isActive: true,
          tagIds: allTags.map(t => t.id),
          sourceType: sourceFileInfo?.type || null,
          sourceUrl: sourceFileInfo?.url || null,
          sourceKey: sourceFileInfo?.key || null,
          sourceFilename: sourceFileInfo?.filename || null
        }

        await dispatch(createSummaryNote(payload))

        // Refresh the list
        await dispatch(fetchAdminSummaryNotes({}, 1, 30))

        // Reset form and clear generated content
        form.resetForm()
        dispatch(clearGeneratedContent())

        // Close modal
        if (onClose) {
          onClose()
        }
      } catch (err) {
        dispatch(setError('Gagal menyimpan ringkasan. Silakan coba lagi.'))
      }
    }
  })
  
  // Handle AI-generated content
  useEffect(() => {
    if (generatedContent?.content) {
      // Convert generated markdown to BlockNote blocks
      const blocks = markdownToBlocks(generatedContent.content)
      form.setFieldValue('content', blocks)

      // Store file info from generation
      if (generatedContent.fileInfo) {
        setSourceFileInfo({
          url: generatedContent.fileInfo.url,
          key: generatedContent.fileInfo.key,
          filename: generatedContent.fileInfo.originalFilename || generatedContent.filename,
          type: generatedContent.mimeType
        })
      }
    }
  }, [generatedContent])

  const handleFileSelect = (e) => {
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

      setUploadedFile(file)
      dispatch(clearError())
    }
  }

  const handleGenerate = async () => {
    if (!uploadedFile) {
      dispatch(setError('Pilih file terlebih dahulu.'))
      return
    }

    try {
      dispatch(clearError())
      await dispatch(generateSummaryFromDocument(uploadedFile))
    } catch (err) {
      dispatch(setError('Gagal generate ringkasan. Silakan coba lagi.'))
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    setSourceFileInfo(null)
    dispatch(clearGeneratedContent())
  }

  return {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    uploadedFile,
    sourceFileInfo
  }
}
