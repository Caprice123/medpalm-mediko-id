import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { generateSummaryFromDocument } from '@store/summaryNotes/action'
import { actions } from '@store/summaryNotes/reducer'
import {
  Container,
  Header,
  Title,
  Description,
  UploadArea,
  UploadIcon,
  UploadText,
  FileInfo,
  FileIcon,
  FileName,
  FileSize,
  ActionButtons,
  GenerateButton,
  RemoveButton
} from './GenerateFromDocument.styles'

const { setError, clearError } = actions

const GenerateFromDocument = ({ onGenerateComplete }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.summaryNotes)
  const [uploadedFile, setUploadedFile] = useState(null)

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

      // Reset file and call callback to open create modal
      setUploadedFile(null)
      if (onGenerateComplete) {
        onGenerateComplete()
      }
    } catch (err) {
      dispatch(setError('Gagal generate ringkasan. Silakan coba lagi.'))
    }
  }

  const handleRemoveFile = () => {
    setUploadedFile(null)
    dispatch(clearError())
  }

  const getFileIcon = (type) => {
    if (!type) return '📄'
    if (type.includes('pdf')) return '📕'
    if (type.includes('presentation') || type.includes('powerpoint')) return '📊'
    if (type.includes('document') || type.includes('word')) return '📘'
    return '📄'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <Container>
      <Header>
        <Title>✨ Generate Ringkasan dari Dokumen</Title>
        <Description>
          Upload dokumen (PDF, PPTX, atau DOCX) dan AI akan membantu membuat ringkasan materi
        </Description>
      </Header>

      {!uploadedFile ? (
        <UploadArea onClick={() => document.getElementById('doc-upload').click()}>
          <input
            id="doc-upload"
            type="file"
            accept=".pdf,.pptx,.docx"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
          />
          <UploadIcon>📤</UploadIcon>
          <UploadText>
            {loading.isGenerating ? 'Uploading...' : 'Klik untuk upload dokumen'}
          </UploadText>
          <UploadText style={{ fontSize: '0.85rem', color: '#9ca3af' }}>
            PDF, PPTX, atau DOCX (max 50MB)
          </UploadText>
        </UploadArea>
      ) : (
        <FileInfo>
          <FileIcon>{getFileIcon(uploadedFile.type)}</FileIcon>
          <div style={{ flex: 1 }}>
            <FileName>{uploadedFile.name}</FileName>
            <FileSize>{formatFileSize(uploadedFile.size)}</FileSize>
          </div>
          <ActionButtons>
            <GenerateButton
              onClick={handleGenerate}
              disabled={loading.isGenerating}
            >
              {loading.isGenerating ? 'Generating...' : '✨ Generate Ringkasan'}
            </GenerateButton>
            <RemoveButton onClick={handleRemoveFile} disabled={loading.isGenerating}>
              Hapus
            </RemoveButton>
          </ActionButtons>
        </FileInfo>
      )}
    </Container>
  )
}

export default GenerateFromDocument
