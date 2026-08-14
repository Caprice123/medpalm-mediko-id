import Modal from '@components/common/Modal'
import Loading from '@components/common/Loading'
import CardBody from '@routes/Flashcard/v2-1/pages/TopicList/components/AnkiPlayer/components/CardBody'
import { useCardPreviewModal } from './hooks/useCardPreviewModal'

export default function CardPreviewModal({ card, cardId, nodeId, onClose }) {
  const { resolvedCard, isLoading, revealed, handleReveal } = useCardPreviewModal({ card, cardId, nodeId })

  return (
    <Modal isOpen title="📖 Preview Flashcard" size="medium" onClose={onClose}>
      {isLoading || !resolvedCard ? (
        <Loading />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <CardBody card={resolvedCard} revealed={revealed} onReveal={handleReveal} />
        </div>
      )}
    </Modal>
  )
}
