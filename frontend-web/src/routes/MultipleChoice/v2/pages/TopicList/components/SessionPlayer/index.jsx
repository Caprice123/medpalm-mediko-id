import { useSelector } from 'react-redux'
import McqSession from '../Session'

// Renders the running session where it was started from — under the open topic
// or under the "Sesi Kustom" button.
export default function SessionPlayer({ onClose }) {
  const sessionQuestions = useSelector(s => s.mcqNodes.sessionQuestions)

  if (sessionQuestions.length === 0) return null

  return <McqSession onClose={onClose} />
}
