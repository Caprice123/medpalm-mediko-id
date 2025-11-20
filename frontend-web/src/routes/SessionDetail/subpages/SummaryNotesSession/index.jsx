import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNoteSession } from '@store/summaryNotes/action'
import { fetchCreditBalance } from '@store/credit/action'
import NoteList from './components/NoteList'
import NoteViewer from './components/NoteViewer'
import { Container, LoadingContainer, LoadingSpinner } from './SummaryNotesSession.styles'

function SummaryNotesSession({ sessionId }) {
  const dispatch = useDispatch()
  const [currentView, setCurrentView] = useState(null) // 'select_note' or 'view_note'

  const { noteSession } = useSelector(state => state.summaryNotes)
  const { isSessionLoading } = useSelector(state => state.summaryNotes.loading)

  useEffect(() => {
    // Try to fetch existing session first
    const loadSession = async () => {
      try {
        await dispatch(fetchSummaryNoteSession(sessionId))
        setCurrentView('view_note')
      } catch {
        // No session exists yet, show note selection
        dispatch(fetchCreditBalance())
        setCurrentView('select_note')
      }
    }

    loadSession()
  }, [dispatch, sessionId])

  const handleNoteSelected = () => {
    setCurrentView('view_note')
  }

  if (isSessionLoading || !currentView) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  return (
    <Container>
      {currentView === 'select_note' && (
        <NoteList
          sessionId={sessionId}
          onNoteSelected={handleNoteSelected}
        />
      )}
      {currentView === 'view_note' && noteSession && (
        <NoteViewer
          session={noteSession}
        />
      )}
    </Container>
  )
}

export default SummaryNotesSession
