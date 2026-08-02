import {
  CountLabel, SessionRow, CountInput, StartButton,
  PlayerHeader, PlayerStats, PlayerCounter, PlayerBackBtn, PlayerProgress, PlayerFill,
} from '../../PreviewPanel.styles'
import {
  PlayerFlipArea, PlayerFlipCard, PlayerFront, PlayerBack,
  PlayerCardLabel, PlayerCardText, PlayerFlipHint,
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
    isStarting,
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

  return (
    <>
      <PlayerHeader>
        <PlayerStats><PlayerCounter>Kartu <b>{cardIndex + 1}</b> dari {queue.length}</PlayerCounter></PlayerStats>
        <PlayerBackBtn onClick={handleExit}>✕</PlayerBackBtn>
      </PlayerHeader>
      <PlayerProgress><PlayerFill $progress={(cardIndex / queue.length) * 100} /></PlayerProgress>
      <PlayerFlipArea $clickable={!revealed} onClick={!revealed ? handleReveal : undefined}>
        <PlayerFlipCard $flipped={revealed}>
          <PlayerFront>
            <PlayerCardLabel>Pertanyaan</PlayerCardLabel>
            <PlayerCardText>{card?.front}</PlayerCardText>
            {!revealed && <PlayerFlipHint>Klik untuk flip</PlayerFlipHint>}
          </PlayerFront>
          <PlayerBack>
            <PlayerCardLabel>Jawaban</PlayerCardLabel>
            <PlayerCardText>{card?.back}</PlayerCardText>
          </PlayerBack>
        </PlayerFlipCard>
      </PlayerFlipArea>
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
