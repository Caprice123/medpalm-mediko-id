import Modal from '@components/common/Modal'
import Button from '@components/common/Button'
import { useSwapNodeOrderModal } from './hooks/useSwapNodeOrderModal'
import { OptionList, OptionRow, OptionIcon, OptionLabel, EmptyState } from './SwapNodeOrderModal.styles'

export default function SwapNodeOrderModal({ node, onClose, onSwapped }) {
  const { options, handleSwap, isSwapping } = useSwapNodeOrderModal(node, onClose, onSwapped)

  return (
    <Modal
      isOpen
      onClose={onClose}
      title={`Tukar Posisi — ${node.name}`}
      size="small"
      footer={
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary" onClick={onClose}>Tutup</Button>
        </div>
      }
    >
      {options.length === 0 ? (
        <EmptyState>Tidak ada sub-topik lain untuk ditukar</EmptyState>
      ) : (
        <OptionList>
          {options.map(opt => (
            <OptionRow
              key={opt.value}
              $disabled={isSwapping}
              onClick={() => !isSwapping && handleSwap(opt.value)}
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
