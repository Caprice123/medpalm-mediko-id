import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlashcardDecks } from '@store/flashcard/action'
import { startFlashcardDeck, submitFlashcardProgress, clearSession } from '@store/session/action'
import FlashcardListPage from './pages/List'
import FlashcardPlayer from './components/FlashcardPlayer'
import {
  PageContainer,
  LoadingContainer,
  LoadingSpinner
} from './Flashcard.styles'
import { fetchTags } from '@store/tags/action'
import { actions as tagActions } from '@store/tags/reducer'

function FlashcardPage() {
  const dispatch = useDispatch()

  const { loading } = useSelector(state => state.flashcard)
  const { topicSnapshot } = useSelector(state => state.session)
  const [currentDeckId, setCurrentDeckId] = useState(null)
  const [isStarting, setIsStarting] = useState(false)

  // Fetch decks when component mounts
  useEffect(() => {
    dispatch(fetchFlashcardDecks())
    dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["university", "semester"]}))
    dispatch(fetchTags())
  }, [dispatch])

  const handleStartDeck = async (deck) => {
    try {
      setIsStarting(true)

      // Clear previous session data to ensure fresh card order
      dispatch(clearSession())

      // Start flashcard deck directly (no session creation)
      await dispatch(startFlashcardDeck(deck.id))

      setCurrentDeckId(deck.id)
    } catch (error) {
      console.error('Error starting flashcard:', error)
      alert('Gagal memulai flashcard: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setIsStarting(false)
    }
  }

  const handleSubmitAnswers = async (answers) => {
    try {
      // Submit answers to update spaced repetition data
      await dispatch(submitFlashcardProgress(currentDeckId, answers))

      alert('Sesi selesai! Progress Anda telah disimpan.')

      // Reset state and show deck selection again
      setCurrentDeckId(null)
    } catch (error) {
      console.error('Failed to submit answers:', error)
      alert('Gagal menyimpan progress: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleBackToDeckList = () => {
    // Clear session state when going back
    dispatch(clearSession())
    setCurrentDeckId(null)
  }

  // Show loading state
  if (loading.isLoadingDecks) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat daftar flashcard...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // If starting a deck, show loading
  if (isStarting) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memulai flashcard...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // If deck selected and cards loaded, show player
  if (currentDeckId && topicSnapshot?.cards?.length > 0) {
    return (
      <PageContainer>
        <FlashcardPlayer
          onSubmit={handleSubmitAnswers}
          onBack={handleBackToDeckList}
        />
      </PageContainer>
    )
  }

  // Show deck selection
  return (
    <PageContainer>
      <FlashcardListPage
        onSelectDeck={handleStartDeck}
      />
    </PageContainer>
  )
}

export default FlashcardPage
