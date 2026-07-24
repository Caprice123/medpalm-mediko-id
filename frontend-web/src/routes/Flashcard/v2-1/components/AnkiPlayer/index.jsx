import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { submitFlashcardRating } from '@store/flashcardNodes/userAction'
import {
  Wrapper, DeckContainer, DeckHeader, DeckTitle, BackBtn,
  StatsRow, CardCounter, ReviewedCount,
  ProgressBar, ProgressFill,
  FlipArea, FlipCard, CardFront, CardBack, CardLabel, CardText, CardImage, FlipHint,
  NewBadge, CardNodePath,
  ActionRow, RatingBtn,
} from './AnkiPlayer.styles'

const RATINGS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

const MAX_LAGI = 2

export default function AnkiPlayer({ deck, onBack }) {
  const dispatch = useDispatch()
  const cards = deck.cards || []

  const [queue, setQueue] = useState(() => [...cards])
  const [retryCounts, setRetryCounts] = useState({})
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [ratings, setRatings] = useState([])

  const card = queue[index]
  const progress = (index / queue.length) * 100
  const retryCount = card ? (retryCounts[card.id] || 0) : 0

  const handleReveal = useCallback(() => {
    if (!revealed) setRevealed(true)
  }, [revealed])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space') { e.preventDefault(); handleReveal() }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleReveal])

  const handleRate = (ratingKey) => {
    dispatch(submitFlashcardRating(card.id, ratingKey))

    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_LAGI) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }

    setRatings(prev => [...prev, { cardId: card.id, rating: ratingKey }])

    const nextIndex = index + 1
    if (nextIndex >= newQueue.length) {
      onBack()
    } else {
      setIndex(nextIndex)
      setRevealed(false)
    }
  }

  return (
    <Wrapper>
      <DeckContainer>
        <DeckHeader>
          <DeckTitle>{deck.title}</DeckTitle>
          <BackBtn onClick={onBack} title="Tutup">✕</BackBtn>
        </DeckHeader>

        <StatsRow>
          <CardCounter>Kartu <b>{index + 1}</b> dari {queue.length}</CardCounter>
          <ReviewedCount>{ratings.length} dikerjakan sesi ini</ReviewedCount>
        </StatsRow>

        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>

        <FlipArea $clickable={!revealed} onClick={!revealed ? handleReveal : undefined}>
          <FlipCard $flipped={revealed}>
            <CardFront>
              {card.isNew && <NewBadge>Baru</NewBadge>}
              {(card.topic || card.subtopic) && (
                <CardNodePath>
                  {card.topic?.name}{card.topic && card.subtopic && ' › '}{card.subtopic?.name}
                </CardNodePath>
              )}
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

        {revealed && (
          <ActionRow>
            {RATINGS.map(r => (
              <RatingBtn
                key={r.key}
                $color={r.color}
                onClick={() => handleRate(r.key)}
                disabled={r.key === 'again' && retryCount >= MAX_LAGI}
                title={r.key === 'again' && retryCount >= MAX_LAGI ? 'Batas ulang tercapai' : undefined}
              >
                {r.label}
                {r.key === 'again' && retryCount > 0 && retryCount < MAX_LAGI && (
                  <span style={{ fontSize: '0.625rem', display: 'block', opacity: 0.7 }}>
                    {MAX_LAGI - retryCount}x lagi
                  </span>
                )}
              </RatingBtn>
            ))}
          </ActionRow>
        )}
      </DeckContainer>
    </Wrapper>
  )
}
