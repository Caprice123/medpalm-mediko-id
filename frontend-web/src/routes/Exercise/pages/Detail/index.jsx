import ExercisePlayer from './components/ExercisePlayer'
import ExerciseResult from './components/ExerciseResult'
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

  if (result) {
    return (
      <PageContainer>
        <ExerciseResult
          topic={topicSnapshot}
          result={result}
          onBack={handleBackToTopicList}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <ExercisePlayer
        topic={topicSnapshot}
        onSubmit={handleSubmitAnswers}
        onBack={handleBackToTopicList}
      />
    </PageContainer>
  )
}

export default ExerciseDetailPage
