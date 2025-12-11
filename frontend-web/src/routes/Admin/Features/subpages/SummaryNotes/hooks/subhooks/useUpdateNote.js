import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useFormik } from 'formik'
import {
  updateSummaryNote,
  generateSummaryFromDocument,
  fetchAdminSummaryNotes
} from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import { markdownToBlocks } from '@utils/markdownToBlocks'

const { clearGeneratedContent, setError, clearError } = actions

export const useUpdateNote = (onClose) => {
  const dispatch = useDispatch()
  const { generatedContent, selectedNote } = useSelector(state => state.summaryNotes)
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

        // Combine university and semester tags
        const allTags = [...values.universityTags, ...values.semesterTags]

        const payload = {
          title: values.title.trim(),
          description: values.description.trim(),
          content: contentString,
          status: apiStatus,
          isActive: isActive,
          tagIds: allTags.map(t => t.id),
          sourceType: sourceFileInfo?.type || null,
          sourceUrl: sourceFileInfo?.url || null,
          sourceKey: sourceFileInfo?.key || null,
          sourceFilename: sourceFileInfo?.filename || null
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

      // Separate tags into university and semester
      const universityTags = selectedNote.tags?.filter(t => t.tag_group?.name === 'university') || []
      const semesterTags = selectedNote.tags?.filter(t => t.tag_group?.name === 'semester') || []

      form.setValues({
        title: selectedNote.title || '',
        description: selectedNote.description || '',
        content: parsedContent,
        status: combinedStatus,
        universityTags: universityTags,
        semesterTags: semesterTags
      })

      // Set source file info if exists
      if (selectedNote.source_url) {
        setSourceFileInfo({
          url: selectedNote.source_url,
          key: selectedNote.source_key,
          filename: selectedNote.source_filename,
          type: selectedNote.source_type
        })
      } else {
        setSourceFileInfo(null)
      }
    }
  }, [selectedNote])

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
    dispatch(clearGeneratedContent())
  }

  const handleRemoveSourceFile = () => {
    setSourceFileInfo(null)
    setUploadedFile(null)
  }

  return {
    form,
    handleFileSelect,
    handleGenerate,
    handleRemoveFile,
    handleRemoveSourceFile,
    uploadedFile,
    sourceFileInfo
  }
}
