import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { useRegisterModal } from '../../hooks/useRegisterModal'
import { MAX_EVIDENCE } from '../../utils'
import { InfoBox, UploadedList, UploadedItem, UploadError } from './RegisterModal.styles'

function RegisterModal({ event, onClose, onSuccess }) {
  const {
    uploaded, error,
    isRegisterLoading, isUploading,
    handleFileSelect, handleSubmit, removeFile,
  } = useRegisterModal({ event, onSuccess, onClose })

  const isReapply = event.myRegistrationStatus === 'rejected'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isReapply ? `Daftar Ulang — ${event.title}` : `Daftar — ${event.title}`}
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
      <InfoBox>
        Upload bukti pendaftaran kamu (maks. <strong>{MAX_EVIDENCE} file</strong>, format JPG/PNG/PDF, maks. 10 MB per file).
        {isReapply && ' Ini adalah pendaftaran ulang setelah ditolak.'}
      </InfoBox>

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
