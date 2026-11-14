import { useSelector } from 'react-redux'
import AnkiPlayer from '../AnkiPlayer'

// Renders the running session where it was started from — under the open topic,
// under the "Sesi Kustom" button, or under the Due Today panel.
export default function SessionPlayer({ onClose }) {
  const sessionCards = useSelector(s => s.flashcardNodes.sessionCards)

  if (sessionCards.length === 0) return null

  return (
    <AnkiPlayer
      deck={{ title: 'Sesi Belajar', cards: sessionCards }}
      onBack={onClose}
    />
  )
}
