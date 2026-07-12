import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { submitRating } from '@store/review/userAction'
import {
  Wrapper, BackBtn, DeckContainer, DeckHeader, DeckTitle,
  StatsRow, CardCounter, ReviewedCount,
  ProgressBar, ProgressFill,
  NodeTagsRow, NodeTag,
  FlipArea, FlipCard, CardFront, CardBack, CardLabel, CardText, CardImage, FlipHint,
  ShowAnswerBtn,
  ActionRow, RatingBtn,
  DoneWrap, DoneBanner, DoneIcon, DoneTitle, DoneSub, DoneBody,
  SummaryGrid, SummaryItem, SummaryValue, SummaryLabel,
  DoneActions, DoneSecondaryBtn,
} from './AnkiPlayer.styles'

const RATINGS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

const MAX_LAGI = 2

export default function AnkiPlayer({ deck, onBack, recordType = 'flashcard_card' }) {
  const dispatch = useDispatch()
  const cards = deck.cards || []

  const [queue, setQueue] = useState(() => [...cards])
  const [retryCounts, setRetryCounts] = useState({})
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [ratings, setRatings] = useState([])
  const [done, setDone] = useState(false)

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
    dispatch(submitRating({ recordType, recordId: card.id, rating: ratingKey }))
    const newRatings = [...ratings, { cardId: card.id, rating: ratingKey }]
    setRatings(newRatings)

    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_LAGI) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }

    const nextIndex = index + 1
    if (nextIndex >= newQueue.length) {
      setDone(true)
    } else {
      setIndex(nextIndex)
      setRevealed(false)
    }
  }

  const handleRestart = () => {
    setQueue([...cards])
    setRetryCounts({})
    setIndex(0)
    setRevealed(false)
    setRatings([])
    setDone(false)
  }

  const nodes = deck.nodes || []
  const nodeNames = nodes.map(n => n.nodeName).filter(Boolean)

  if (done) {
    const counts = RATINGS.reduce((acc, r) => {
      acc[r.key] = ratings.filter(x => x.rating === r.key).length
      return acc
    }, {})
    const totalReviews = ratings.length
    const uniqueCards = cards.length

    return (
      <Wrapper>
        <DeckContainer>
          <DoneWrap>
            <DoneBanner>
              <DoneIcon>🎉</DoneIcon>
              <DoneTitle>Sesi Selesai!</DoneTitle>
              <DoneSub>{uniqueCards} kartu · {totalReviews} total ulasan · {deck.title}</DoneSub>
            </DoneBanner>

            <DoneBody>
              <SummaryGrid>
                {RATINGS.map(r => (
                  <SummaryItem key={r.key} $color={r.color}>
                    <SummaryValue $color={r.color}>{counts[r.key]}</SummaryValue>
                    <SummaryLabel>{r.label}</SummaryLabel>
                  </SummaryItem>
                ))}
              </SummaryGrid>

              <DoneActions>
                <DoneSecondaryBtn onClick={handleRestart}>🔁 Ulangi Sesi</DoneSecondaryBtn>
                <ShowAnswerBtn onClick={onBack} style={{ flex: 1 }}>Kembali ke Daftar</ShowAnswerBtn>
              </DoneActions>
            </DoneBody>
          </DoneWrap>
        </DeckContainer>
      </Wrapper>
    )
  }

  return (
    <Wrapper>
      <DeckContainer>
        <DeckHeader>
          <DeckTitle>{deck.title}</DeckTitle>
          <BackBtn onClick={onBack}>← Kembali</BackBtn>
        </DeckHeader>

        <StatsRow>
          <CardCounter>Kartu <b>{index + 1}</b> dari {queue.length}</CardCounter>
          <ReviewedCount>{ratings.length} dikerjakan sesi ini</ReviewedCount>
        </StatsRow>

        <ProgressBar>
          <ProgressFill $progress={progress} />
        </ProgressBar>

        {nodeNames.length > 0 && (
          <NodeTagsRow>
            {nodeNames.map((name, i) => <NodeTag key={i}>{name}</NodeTag>)}
          </NodeTagsRow>
        )}

        <FlipArea $clickable={!revealed} onClick={!revealed ? handleReveal : undefined}>
          <FlipCard $flipped={revealed}>
            <CardFront>
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

        {!revealed ? (
          <ShowAnswerBtn onClick={handleReveal}>
            Tampilkan Jawaban →
          </ShowAnswerBtn>
        ) : (
          <ActionRow>
            {RATINGS.map(r => (
              <RatingBtn
                key={r.key}
                $color={r.color}
                onClick={() => handleRate(r.key)}
                title={r.key === 'again' && retryCount >= MAX_LAGI ? 'Batas ulang tercapai' : undefined}
                style={r.key === 'again' && retryCount >= MAX_LAGI ? { opacity: 0.4, cursor: 'not-allowed' } : undefined}
                disabled={r.key === 'again' && retryCount >= MAX_LAGI}
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
