import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useRegisterModal } from '../../hooks/useRegisterModal'

function RegisterModal({ webinar, onClose, onSuccess }) {
  const { isRegisterLoading, handleSubmit } = useRegisterModal({ webinar, onSuccess, onClose })

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
          <Button variant="primary" onClick={handleSubmit} disabled={isRegisterLoading}>
            {isRegisterLoading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </Button>
        </>
      }
    >
      <p style={{ color: '#374151', fontSize: '0.9375rem', lineHeight: 1.6, margin: 0 }}>
        {isReapply
          ? `Konfirmasi pendaftaran ulang kamu untuk webinar ini. Email konfirmasi akan dikirimkan segera setelah mendaftar.`
          : `Konfirmasi pendaftaran kamu untuk webinar ini. Email konfirmasi akan dikirimkan segera setelah mendaftar.`}
      </p>
    </Modal>
  )
}

export default RegisterModal
