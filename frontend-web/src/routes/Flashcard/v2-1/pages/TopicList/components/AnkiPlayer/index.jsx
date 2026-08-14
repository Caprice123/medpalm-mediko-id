import { useRef, useEffect } from 'react'
import CardBody from './components/CardBody'
import { useAnkiPlayer } from './hooks/useAnkiPlayer'
import {
  Wrapper, DeckContainer, HeaderSection, BodySection, FooterSection,
  DeckHeader, DeckTitle, BackBtn,
  StatsRow, TopicPath,
  ProgressBar, ProgressFill,
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
  const {
    queue, card, index, progress, retryCount,
    revealed, handleReveal,
    handleRate,
  } = useAnkiPlayer({ deck, onBack })

  const hasTopicPath = !!(card.topic || card.subtopic)

  const bodyRef = useRef(null)
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
  }, [card?.id])

  return (
    <Wrapper>
      <DeckContainer>
        <HeaderSection>
          <DeckHeader>
            <DeckTitle>Kartu {index + 1} dari {queue.length}</DeckTitle>
            <BackBtn onClick={onBack} title="Tutup">✕</BackBtn>
          </DeckHeader>

          {hasTopicPath && (
            <StatsRow>
              <TopicPath>
                {card.topic?.name}{card.topic && card.subtopic && ' › '}{card.subtopic?.name}
              </TopicPath>
            </StatsRow>
          )}

          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
        </HeaderSection>

        <BodySection ref={bodyRef}>
          <CardBody card={card} revealed={revealed} onReveal={handleReveal} />
        </BodySection>

        {revealed && (
          <FooterSection>
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
          </FooterSection>
        )}
      </DeckContainer>
    </Wrapper>
  )
}
