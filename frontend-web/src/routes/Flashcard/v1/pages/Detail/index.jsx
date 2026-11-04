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
          <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>
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
          <div style={{ marginTop: '1rem', color: 'var(--color-gray-500)' }}>
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
