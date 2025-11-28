import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  LoadingContainer,
  LoadingSpinner
} from './FlashcardSession.styles'

/**
 * @deprecated This session-based flashcard flow is deprecated.
 * Users are now redirected to the new sessionless /flashcards route.
 */
function FlashcardSession({ sessionId }) {
    const navigate = useNavigate()

    useEffect(() => {
        // Redirect to new sessionless flashcard flow
        console.log('Redirecting from old session-based flashcard to new sessionless flow')
        navigate('/flashcards', { replace: true })
    }, [navigate])

    return (
        <LoadingContainer>
            <LoadingSpinner />
            <div style={{ marginTop: '1rem', color: '#6b7280' }}>
                Mengalihkan ke halaman flashcard...
            </div>
        </LoadingContainer>
    )
}

export default FlashcardSession
