import ExercisePlayer from '../../components/ExercisePlayer'
import { useExerciseDetail } from './useExerciseDetail'
import {
  PageContainer,
  LoadingContainer,
  LoadingSpinner
} from './Detail.styles'

function ExerciseDetailPage() {
  const {
    topicSnapshot,
    isStarting,
    result,
    handleSubmitAnswers,
    handleBackToTopicList
  } = useExerciseDetail()

  // Show loading state while starting
  if (isStarting) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memulai latihan soal...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // Show loading if questions not loaded yet
  if (!topicSnapshot?.questions || topicSnapshot.questions.length === 0) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat soal latihan...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // Show exercise player with result if available
  return (
    <PageContainer>
      <ExercisePlayer
        topic={topicSnapshot}
        result={result}
        onSubmit={handleSubmitAnswers}
        onBack={handleBackToTopicList}
      />
    </PageContainer>
  )
}

export default ExerciseDetailPage
