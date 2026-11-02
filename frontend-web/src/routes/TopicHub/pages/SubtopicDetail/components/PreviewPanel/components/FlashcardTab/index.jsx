import Loading from '@components/common/Loading'
import CardBody from '@routes/Flashcard/v2-1/pages/TopicList/components/AnkiPlayer/components/CardBody'
import {
  CountLabel, SessionRow, CountInput, StartButton,
  PlayerHeader, PlayerStats, PlayerCounter, PlayerBackBtn, PlayerProgress, PlayerFill,
} from '../../PreviewPanel.styles'
import {
  PlayerActionRow, PlayerRatingBtn,
  PlayerDoneWrap, PlayerDoneText,
} from './FlashcardTab.styles'
import { useFlashcardTab, MAX_LAGI } from './hooks/useFlashcardTab'

const RATINGS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

export default function FlashcardTab({ subtopic, flashcardMax }) {
  const {
    count, setCount,
    playing, queue, cardIndex, revealed, done, card, retryCount,
    isStarting, topRef,
    handleStart, handleRate, handleReveal, handleExit,
  } = useFlashcardTab(subtopic, flashcardMax)

  if (!playing) {
    return (
      <>
        <CountLabel>{flashcardMax} kartu tersedia</CountLabel>
        <SessionRow>
          <CountInput
            type="number" min={1} max={flashcardMax} value={count}
            onChange={e => setCount(parseInt(e.target.value) || 1)}
          />
          <StartButton onClick={handleStart} disabled={isStarting || flashcardMax === 0}>
            {isStarting ? 'Memulai...' : 'Mulai Sesi'}
          </StartButton>
        </SessionRow>
      </>
    )
  }

  if (done) {
    return (
      <PlayerDoneWrap>
        <PlayerDoneText>Sesi selesai! Semua kartu telah dikerjakan.</PlayerDoneText>
        <StartButton onClick={handleExit}>Sesi Baru</StartButton>
      </PlayerDoneWrap>
    )
  }

  // the queue is seeded from Redux one render after the session starts, so show
  // the spinner instead of a blank panel while the cards land
  if (!card) return <Loading size="small" text="Menyiapkan kartu..." padding="2rem 0" />

  return (
    <>
      <PlayerHeader ref={topRef}>
        <PlayerStats><PlayerCounter>Kartu <b>{cardIndex + 1}</b> dari {queue.length}</PlayerCounter></PlayerStats>
        <PlayerBackBtn onClick={handleExit}>✕</PlayerBackBtn>
      </PlayerHeader>
      <PlayerProgress><PlayerFill $progress={(cardIndex / queue.length) * 100} /></PlayerProgress>

      {/* same CardBody as the full-page AnkiPlayer, so cloze/occlusion cards and the
          explanation + reference panel behave identically inside the drawer */}
      <CardBody card={card} revealed={revealed} onReveal={handleReveal} />

      {revealed && (
        <PlayerActionRow>
          {RATINGS.map(r => (
            <PlayerRatingBtn key={r.key} $color={r.color} onClick={() => handleRate(r.key)} disabled={r.key === 'again' && retryCount >= MAX_LAGI}>
              {r.label}
            </PlayerRatingBtn>
          ))}
        </PlayerActionRow>
      )}
    </>
  )
}
