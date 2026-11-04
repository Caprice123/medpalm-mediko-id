import { PiCheckCircle, PiWarningCircle, PiArrowCounterClockwise } from 'react-icons/pi'
import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import FileUpload from '@components/common/FileUpload'
import { MAX_EVIDENCE, describeReward } from '../../utils/claimState'
import RewardLine from '../RewardLine'
import { useClaimModal } from './hooks/useClaimModal'
import {
  FieldLabel, HelpText, UploadedList, UploadedItem,
  SlotCount, ClaimError, ReclaimNote, RewardReminder,
} from './ClaimModal.styles'

function ClaimModal({ event, featureLabels, onClose, onSuccess }) {
  const {
    isClaiming, isUploading, uploadedFiles, error, canAddMore,
    handleFileSelect, removeFile, handleSubmit,
  } = useClaimModal({ event, onSuccess, onClose })

  const isReclaim = event.myRegistrationStatus === 'rejected'
  const reward = describeReward(event, featureLabels)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={isReclaim ? `Klaim ulang — ${event.title}` : `Klaim — ${event.title}`}
      size="medium"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={isClaiming}>
            Batal
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={isClaiming || isUploading}
          >
            {isClaiming ? 'Mengirim…' : 'Kirim klaim'}
          </Button>
        </>
      }
    >
      {isReclaim && (
        <ReclaimNote>
          <PiArrowCounterClockwise size={15} aria-hidden="true" />
          Klaim sebelumnya ditolak. Unggah bukti yang diperbaiki, lalu kirim ulang —
          admin akan mereview dari awal.
        </ReclaimNote>
      )}

      {!reward.isEmpty && (
        <RewardReminder>
          <RewardLine reward={reward} />
        </RewardReminder>
      )}

      <FieldLabel>Bukti klaim</FieldLabel>
      <HelpText>
        Unggah bukti yang diminta di deskripsi event — misalnya tangkapan layar follow
        atau kartu mahasiswa. Maksimal {MAX_EVIDENCE} file berupa gambar atau PDF,
        masing-masing di bawah 10 MB.
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
                disabled={isClaiming}
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
        <ClaimError role="alert">
          <PiWarningCircle size={15} aria-hidden="true" />
          {error}
        </ClaimError>
      )}
    </Modal>
  )
}

export default ClaimModal
