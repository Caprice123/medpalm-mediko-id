import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSessionDetail } from '@store/session/action'
import ExerciseSessionSubpage from './subpages/ExerciseSession'
import FlashcardSessionSubpage from './subpages/FlashcardSession'
import SummaryNotesSessionSubpage from './subpages/SummaryNotesSession'
import { LoadingContainer, LoadingSpinner } from './SessionDetail.styles'

function SessionDetail() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const { sessionDetail: currentSession } = useSelector(state => state.session)
  const { isLoadingDetail } = useSelector(state => state.session.loading)

  useEffect(() => {
    // Fetch session detail
    const loadSession = async () => {
        await dispatch(fetchSessionDetail(sessionId))
    }

    loadSession()
  }, [dispatch, sessionId, navigate])

  if (isLoadingDetail || !currentSession) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <div style={{ marginTop: '1rem', color: '#6b7280' }}>
          Memuat sesi...
        </div>
      </LoadingContainer>
    )
  }

  // Route to appropriate subpage based on session type
  const sessionType = currentSession?.session_type || currentSession?.type || 'exercise'

  if (sessionType === 'flashcard') {
    return <FlashcardSessionSubpage sessionId={sessionId} />
  }

  if (sessionType === 'summary_notes') {
    return <SummaryNotesSessionSubpage sessionId={sessionId} />
  }

  // Default to exercise
  return <ExerciseSessionSubpage sessionId={sessionId} />
}

export default SessionDetail
