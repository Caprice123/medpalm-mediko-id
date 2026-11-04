import { PiCheckCircle, PiWarningCircle, PiArrowCounterClockwise } from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { MAX_EVIDENCE } from '../../utils/registrationState'
import { useRegisterModal } from './hooks/useRegisterModal'
import {
  FieldLabel, HelpText, UploadedList, UploadedItem,
  SlotCount, UploadError, ReapplyNote,
} from './RegisterModal.styles'

function RegisterModal({ webinar, onClose, onSuccess }) {
  const {
    isRegistering, isUploading, uploadedFiles, error, canAddMore,
    handleFileSelect, removeFile, handleSubmit,
  } = useRegisterModal({ webinar, onSuccess, onClose })

  const isReapply = webinar.myRegistrationStatus === 'rejected'

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isReapply ? `Daftar ulang — ${webinar.title}` : `Daftar — ${webinar.title}`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isRegistering}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isRegistering || isUploading}
          >
            {isRegistering ? 'Mengirim…' : 'Kirim pendaftaran'}
          </Button>
        </>
      }
    >
      {isReapply && (
        <ReapplyNote>
          <PiArrowCounterClockwise size={15} aria-hidden="true" />
          Pendaftaran sebelumnya ditolak. Unggah bukti yang diperbaiki, lalu kirim ulang —
          admin akan mereview dari awal.
        </ReapplyNote>
      )}

      <FieldLabel>Bukti pendaftaran</FieldLabel>
      <HelpText>
        Unggah bukti pembayaran, KTM, atau dokumen lain yang diminta penyelenggara.
        Maksimal {MAX_EVIDENCE} file berupa gambar atau PDF, masing-masing di bawah 10 MB.
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
          {uploadedFiles.map((file, i) => (
            <UploadedItem key={i}>
              <PiCheckCircle size={17} aria-hidden="true" />
              <span>{file.filename}</span>
              <Button
                variant="secondary"
                size="small"
                onClick={() => removeFile(i)}
                disabled={isRegistering}
              >
                Hapus
              </Button>
            </UploadedItem>
          ))}
        </UploadedList>
      )}

      {uploadedFiles.length > 0 && canAddMore && (
        <SlotCount>
          {uploadedFiles.length} dari {MAX_EVIDENCE} file terunggah.
        </SlotCount>
      )}

      {error && (
        <UploadError role="alert">
          <PiWarningCircle size={15} aria-hidden="true" />
          {error}
        </UploadError>
      )}
    </Modal>
  )
}

export default RegisterModal
