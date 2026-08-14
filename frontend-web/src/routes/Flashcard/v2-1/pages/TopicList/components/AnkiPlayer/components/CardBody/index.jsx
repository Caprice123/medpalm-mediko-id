import ClozeCard from '../ClozeCard'
import OcclusionCard from '../OcclusionCard'
import CardExtrasPanel from '../CardExtrasPanel'
import {
  FlipArea, FlipCard, CardFront, CardBack, CardLabel, CardText, CardImage, FlipHint, NewBadge,
} from './CardBody.styles'

export default function CardBody({ card, revealed, onReveal }) {
  const cardKey = card.id ?? 'preview'

  return (
    <>
      {card.type === 'cloze' && (
        <ClozeCard key={`card-${cardKey}`} text={card.front} answers={card.clozeAnswers} onFullyRevealed={onReveal} />
      )}

      {card.type === 'occlusion' && (
        <OcclusionCard key={`card-${cardKey}`} imageUrl={card.imageUrl} regions={card.occlusionRegions} onFullyRevealed={onReveal} />
      )}

      {(!card.type || card.type === 'basic') && (
        <FlipArea key={`card-${cardKey}`} $clickable={!revealed} onClick={!revealed ? onReveal : undefined}>
          <FlipCard $flipped={revealed}>
            <CardFront>
              {card.isNew && <NewBadge>Baru</NewBadge>}
              <CardLabel>Pertanyaan</CardLabel>
              <CardText>{card.front}</CardText>
              {card.imageUrl && <CardImage src={card.imageUrl} alt="" />}
              <FlipHint>Klik kartu atau tekan spasi untuk flip</FlipHint>
            </CardFront>
            <CardBack>
              <CardLabel>Jawaban</CardLabel>
              <CardText>{card.back}</CardText>
            </CardBack>
          </FlipCard>
        </FlipArea>
      )}

      {revealed && (
        <CardExtrasPanel
          key={cardKey}
          explanationShort={card.explanationShort}
          explanationLong={card.explanationLong}
          references={card.references}
          linkedSummaryNotes={card.linkedSummaryNotes}
        />
      )}
    </>
  )
}
