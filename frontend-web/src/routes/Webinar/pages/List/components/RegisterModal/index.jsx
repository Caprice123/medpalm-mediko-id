import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { useRegisterModal } from '../../hooks/useRegisterModal'
import { MAX_EVIDENCE } from '../../utils'
import { UploadedList, UploadedItem, UploadError } from './RegisterModal.styles'

function RegisterModal({ webinar, onClose, onSuccess }) {
  const {
    uploaded, error,
    isRegisterLoading, isUploading,
    handleFileSelect, handleSubmit, removeFile,
  } = useRegisterModal({ webinar, onSuccess, onClose })

  const isReapply = webinar.myRegistrationStatus === 'rejected'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isReapply ? `Daftar Ulang — ${webinar.title}` : `Daftar — ${webinar.title}`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Batal</Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isRegisterLoading || isUploading}
          >
            {isRegisterLoading ? 'Mengirim...' : 'Kirim Pendaftaran'}
          </Button>
        </>
      }
    >
      <UploadError style={{ color: '#b45309', background: '#fef9c3', border: '1px solid #fde68a', borderRadius: 6, padding: '0.5rem 0.75rem', marginBottom: '1rem', fontSize: '0.8125rem' }}>
        Upload bukti pendaftaran kamu (maks. <strong>{MAX_EVIDENCE} file</strong>, format JPG/PNG/PDF, maks. 10 MB per file).
        {isReapply && ' Bukti sebelumnya akan digantikan dengan file baru.'}
      </UploadError>

      {uploaded.length < MAX_EVIDENCE && (
        <FileUpload
          file={null}
          onFileSelect={handleFileSelect}
          acceptedTypes={['image/jpeg', 'image/png', 'image/webp', 'application/pdf']}
          acceptedTypesLabel="JPG, PNG, PDF"
          maxSizeMB={10}
          isUploading={isUploading}
          uploadText={`Klik untuk upload bukti (${uploaded.length}/${MAX_EVIDENCE} file)`}
          multiple
        />
      )}

      {uploaded.length > 0 && (
        <UploadedList>
          {uploaded.map((f, i) => (
            <UploadedItem key={i}>
              <span>✅ {f.name}</span>
              <Button variant="ghost" onClick={() => removeFile(i)}>✕</Button>
            </UploadedItem>
          ))}
        </UploadedList>
      )}

      {error && <UploadError>{error}</UploadError>}
    </Modal>
  )
}

export default RegisterModal
