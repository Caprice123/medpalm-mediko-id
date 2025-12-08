import {
  ConfirmOverlay,
  ConfirmDialog,
  ConfirmIcon,
  ConfirmTitle,
  ConfirmMessage,
  ConfirmActions,
  Button
} from './ConfirmationModal.styles'

/**
 * Reusable Confirmation Modal component
 *
 * @param {Object} props
 * @param {boolean} props.isOpen - Control modal visibility
 * @param {Function} props.onConfirm - Callback when user confirms
 * @param {Function} props.onCancel - Callback when user cancels
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.icon - Icon emoji (default: ⚠️)
 * @param {string} props.confirmText - Confirm button text (default: Ya, Keluar)
 * @param {string} props.cancelText - Cancel button text (default: Batalkan)
 */
function ConfirmationModal({
  isOpen,
  onConfirm,
  onCancel,
  title = 'Konfirmasi Keluar',
  message = 'Anda memiliki perubahan yang belum disimpan. Apakah Anda yakin ingin keluar? Semua perubahan akan hilang.',
  icon = '⚠️',
  confirmText = 'Ya, Keluar',
  cancelText = 'Batalkan'
}) {
  if (!isOpen) return null

  return (
    <ConfirmOverlay isOpen={isOpen} onClick={onCancel}>
      <ConfirmDialog onClick={e => e.stopPropagation()}>
        <ConfirmIcon>{icon}</ConfirmIcon>
        <ConfirmTitle>{title}</ConfirmTitle>
        <ConfirmMessage>{message}</ConfirmMessage>
        <ConfirmActions>
          <Button onClick={onCancel}>
            {cancelText}
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </ConfirmActions>
      </ConfirmDialog>
    </ConfirmOverlay>
  )
}

export default ConfirmationModal
