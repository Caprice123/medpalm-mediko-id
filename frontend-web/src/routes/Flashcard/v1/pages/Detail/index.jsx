import FlashcardPlayer from './components/FlashcardPlayer'
import { useFlashcardDetail } from './useFlashcardDetail'
import {
  PageContainer,
  LoadingContainer,
  LoadingSpinner
} from './Detail.styles'

function FlashcardDetailPage() {
  const {
    topicSnapshot,
    isStarting,
    handleSubmitAnswers,
    handleBackToDeckList
  } = useFlashcardDetail()

  // Show loading state while starting
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

  // Show loading if cards not loaded yet
  if (!topicSnapshot?.cards || topicSnapshot.cards.length === 0) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat kartu flashcard...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // Show flashcard player
  return (
    <PageContainer>
      <FlashcardPlayer
        onSubmit={handleSubmitAnswers}
        onBack={handleBackToDeckList}
      />
    </PageContainer>
  )
}

export default FlashcardDetailPage
