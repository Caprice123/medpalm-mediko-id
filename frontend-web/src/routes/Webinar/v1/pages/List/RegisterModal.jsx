import { useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { upload } from '@store/common/action'
import { registerWebinar } from '@store/webinar/userAction'
import {
  FormSection,
  Label,
  HelpText,
  UploadArea,
  FileList,
  FileItem,
  ErrorText,
} from './RegisterModal.styles'

function RegisterModal({ webinar, onClose, onSuccess }) {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.webinar)
  const { loading: commonLoading } = useSelector(state => state.common)
  const fileInputRef = useRef(null)

  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState('')

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setError('')

    for (const file of files) {
      const result = await dispatch(upload(file, 'webinar-evidence'))
      setUploadedFiles(prev => [
        ...prev,
        { blobId: result.blobId, filename: result.filename || file.name },
      ])
    }
    e.target.value = ''
  }

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = () => {
    if (uploadedFiles.length === 0) {
      setError('Harap upload minimal satu bukti pembayaran/dokumen.')
      return
    }
    dispatch(
      registerWebinar(
        webinar.uniqueId,
        uploadedFiles.map(f => f.blobId),
        () => {
          if (onSuccess) onSuccess()
          onClose()
        }
      )
    )
  }

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Daftar Webinar — ${webinar.title}`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading.isRegisterLoading || commonLoading.isUploading}
          >
            {loading.isRegisterLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </Button>
        </>
      }
    >
      <FormSection>
        <Label>Upload Bukti (bisa lebih dari satu) *</Label>
        <HelpText>
          Upload bukti pembayaran, KTM, atau dokumen lain yang diperlukan untuk mendaftar.
        </HelpText>

        <UploadArea
          onClick={() => fileInputRef.current?.click()}
          style={{ marginTop: '0.75rem' }}
        >
          {commonLoading.isUploading
            ? 'Mengunggah file...'
            : '📎 Klik untuk memilih file (bisa pilih beberapa)'}
        </UploadArea>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,application/pdf"
          multiple
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {uploadedFiles.length > 0 && (
          <FileList>
            {uploadedFiles.map((f, i) => (
              <FileItem key={i}>
                <span>✅ {f.filename}</span>
                <Button variant="ghost" onClick={() => removeFile(i)}>✕</Button>
              </FileItem>
            ))}
          </FileList>
        )}

        {error && <ErrorText>{error}</ErrorText>}
      </FormSection>
    </Modal>
  )
}

export default RegisterModal
