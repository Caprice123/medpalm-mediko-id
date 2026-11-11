import Button from '@components/common/Button'
import { Overlay, Dialog, Title, Message, Actions } from './UnsavedChangesDialog.styles'

// Not the common ConfirmationModal: this asks a three-way question — save and
// leave, leave anyway, or stay — and that component offers two answers.
const UnsavedChangesDialog = ({
  isOpen,
  isSaving,
  onSaveAndLeave,
  onLeaveWithoutSaving,
  onCancel,
}) => {
  if (!isOpen) return null

  return (
    // Clicking the backdrop means "stay", which is the safe answer: it is the
    // only one that cannot lose work.
    <Overlay onClick={onCancel}>
      <Dialog onClick={(e) => e.stopPropagation()}>
        <Title>⚠️ Perubahan Belum Disimpan</Title>
        <Message>
          Anda memiliki perubahan yang belum disimpan. Apa yang ingin Anda lakukan?
        </Message>
        <Actions>
          <Button variant="secondary" onClick={onCancel} disabled={isSaving}>
            Tetap di Sini
          </Button>
          <Button variant="danger" onClick={onLeaveWithoutSaving} disabled={isSaving}>
            Tinggalkan Tanpa Menyimpan
          </Button>
          <Button variant="primary" onClick={onSaveAndLeave} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan & Tinggalkan'}
          </Button>
        </Actions>
      </Dialog>
    </Overlay>
  )
}

export default UnsavedChangesDialog
