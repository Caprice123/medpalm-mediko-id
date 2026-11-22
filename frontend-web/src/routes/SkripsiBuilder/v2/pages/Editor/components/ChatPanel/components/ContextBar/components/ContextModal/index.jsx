import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import ContextPicker from '../../../../../ContextPicker'
import { Intro } from './ContextModal.styles'

// The picker for the chat tab. It writes straight to Redux as each box is
// ticked - there is no draft to save and nothing to cancel, so the footer only
// closes it, and a student who opens it to check what is attached can close it
// the same way they would a tooltip.
const ContextModal = ({
  isOpen,
  onClose,
  context,
  sections,
  selectedSectionIds,
  hasCase,
  hasCitations,
  onToggle,
  onToggleSection,
}) => (
  <Modal
    isOpen={isOpen}
    onClose={onClose}
    title="Konteks untuk AI"
    size="small"
    footer={<Button variant="primary" onClick={onClose}>Selesai</Button>}
  >
    <Intro>
      Yang dicentang ikut terkirim bersama pertanyaan berikutnya, dan tetap terpasang
      sampai kamu ubah lagi.
    </Intro>

    <ContextPicker
      context={context}
      sections={sections}
      selectedSectionIds={selectedSectionIds}
      hasCase={hasCase}
      hasCitations={hasCitations}
      onToggle={onToggle}
      onToggleSection={onToggleSection}
    />
  </Modal>
)

export default ContextModal
