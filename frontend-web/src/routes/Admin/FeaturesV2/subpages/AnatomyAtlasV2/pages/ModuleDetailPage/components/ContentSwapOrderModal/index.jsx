import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { OptionList, OptionRow, OptionIcon, OptionLabel, EmptyState } from './ContentSwapOrderModal.styles'

// Presentational — item/onSwap wiring lives in the two content-specific hooks that use this.
export default function ContentSwapOrderModal({ title, options, onSwap, isSwapping, onClose }) {
  return (
    <Modal
      isOpen
      onClose={onClose}
      title={title}
      size="small"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      {options.length === 0 ? (
        <EmptyState>Tidak ada konten lain untuk ditukar</EmptyState>
      ) : (
        <OptionList>
          {options.map(opt => (
            <OptionRow
              key={opt.value}
              $disabled={isSwapping}
              onClick={() => !isSwapping && onSwap(opt.value)}
            >
              <OptionIcon>📄</OptionIcon>
              <OptionLabel>{opt.label}</OptionLabel>
            </OptionRow>
          ))}
        </OptionList>
      )}
    </Modal>
  )
}
