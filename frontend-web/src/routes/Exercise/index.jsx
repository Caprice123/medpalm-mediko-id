import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchExerciseTopics, startExerciseTopic, submitExerciseProgress } from '@store/exercise/action'
import TopicList from './components/TopicList'
import ExercisePlayer from './components/ExercisePlayer'
import {
  PageContainer,
  LoadingContainer,
  LoadingSpinner
} from './Exercise.styles'

function ExercisePage() {
  const dispatch = useDispatch()

  const { topics, loading } = useSelector(state => state.exercise)
  const [currentTopicId, setCurrentTopicId] = useState(null)
  const [topicSnapshot, setTopicSnapshot] = useState(null)
  const [isStarting, setIsStarting] = useState(false)

  // Fetch topics when component mounts
  useEffect(() => {
    dispatch(fetchExerciseTopics())
  }, [dispatch])

  const handleStartTopic = async (topic) => {
    try {
      setIsStarting(true)

      // Start exercise topic directly (sessionless)
      const result = await dispatch(startExerciseTopic(topic.id))

      setCurrentTopicId(topic.id)
      setTopicSnapshot(result.topic)
    } catch (error) {
      console.error('Error starting exercise:', error)
      alert('Gagal memulai latihan soal: ' + (error.message || 'Terjadi kesalahan'))
    } finally {
      setIsStarting(false)
    }
  }

  const handleSubmitAnswers = async (answers) => {
    try {
      // Submit answers to update spaced repetition data
      const result = await dispatch(submitExerciseProgress(currentTopicId, answers))

      alert(`Latihan selesai! Skor Anda: ${result.score}% (${result.correct_questions}/${result.total_questions} benar)`)

      // Reset state and show topic selection again
      setCurrentTopicId(null)
      setTopicSnapshot(null)
    } catch (error) {
      console.error('Failed to submit answers:', error)
      alert('Gagal menyimpan progress: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleBackToTopicList = () => {
    // Clear state when going back
    setCurrentTopicId(null)
    setTopicSnapshot(null)
  }

  // Show loading state
  if (loading.isTopicsLoading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner />
          <div style={{ marginTop: '1rem', color: '#6b7280' }}>
            Memuat daftar topik latihan...
          </div>
        </LoadingContainer>
      </PageContainer>
    )
  }

  // If starting a topic, show loading
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

  // If topic selected and questions loaded, show player
  if (currentTopicId && topicSnapshot?.questions?.length > 0) {
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

  // Show topic selection
  return (
    <PageContainer>
      <TopicList
        topics={topics}
        onSelectTopic={handleStartTopic}
      />
    </PageContainer>
  )
}

export default ExercisePage
