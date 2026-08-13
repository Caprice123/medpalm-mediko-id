import Modal from '@components/common/Modal'
import ClozeCard from '@routes/Flashcard/v2-1/pages/TopicList/components/AnkiPlayer/components/ClozeCard'
import OcclusionCard from '@routes/Flashcard/v2-1/pages/TopicList/components/AnkiPlayer/components/OcclusionCard'
import BasicPreview from './components/BasicPreview'

export default function CardPreviewModal({ card, onClose }) {
  return (
    <Modal isOpen title="📖 Preview Flashcard" size="medium" onClose={onClose}>
      {card.type === 'cloze' && <ClozeCard text={card.front} answers={card.clozeAnswers} />}
      {card.type === 'occlusion' && <OcclusionCard imageUrl={card.imageUrl} regions={card.occlusionRegions} />}
      {(!card.type || card.type === 'basic') && (
        <BasicPreview front={card.front} back={card.back} imageUrl={card.imageUrl} />
      )}
    </Modal>
  )
}
