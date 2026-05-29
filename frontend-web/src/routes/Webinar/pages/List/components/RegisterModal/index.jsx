import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { useRegisterModal } from '../../hooks/useRegisterModal'
import { Label, HelpText, UploadedList, UploadedItem, UploadError } from './RegisterModal.styles'

function RegisterModal({ webinar, onClose, onSuccess }) {
  const {
    isRegisterLoading,
    isUploading,
    uploadedFiles,
    error,
    canAddMore,
    handleFileSelect,
    removeFile,
    handleSubmit,
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
            {isRegisterLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </Button>
        </>
      }
    >
      <Label>Upload Bukti Pendaftaran *</Label>
      <HelpText>
        Upload bukti pembayaran, KTM, atau dokumen lain yang diperlukan. Maks. 3 file (gambar atau PDF).
      </HelpText>
      {canAddMore && (
        <FileUpload
          file={null}
          onFileSelect={handleFileSelect}
          acceptedTypes={['image/*', 'application/pdf']}
          acceptedTypesLabel="Gambar, PDF"
          maxSizeMB={10}
          isUploading={isUploading}
          uploadText="Klik untuk memilih file"
          multiple
        />
      )}
      {uploadedFiles.length > 0 && (
        <UploadedList>
          {uploadedFiles.map((f, i) => (
            <UploadedItem key={i}>
              <span>{f.filename}</span>
              <Button variant="ghost" size="small" onClick={() => removeFile(i)}>Hapus</Button>
            </UploadedItem>
          ))}
        </UploadedList>
      )}
      {error && <UploadError>{error}</UploadError>}
    </Modal>
  )
}

export default RegisterModal
