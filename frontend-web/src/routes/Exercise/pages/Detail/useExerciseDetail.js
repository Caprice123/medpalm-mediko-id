import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startExerciseTopic, submitExerciseProgress } from '@store/exercise/action'
import { ExerciseRoute } from '../../routes'

export const useExerciseDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const [topicSnapshot, setTopicSnapshot] = useState(null)
  const [isStarting, setIsStarting] = useState(false)
  const [result, setResult] = useState(null)

  // Start the topic when component mounts
  useEffect(() => {
    const startTopic = async () => {
      try {
        setIsStarting(true)

        // Start exercise topic
        const result = await dispatch(startExerciseTopic(id))
        setTopicSnapshot(result.topic)
      } catch (error) {
        console.error('Error starting exercise:', error)
        alert('Gagal memulai latihan soal: ' + (error.message || 'Terjadi kesalahan'))
        // Navigate back to list on error
        navigate(ExerciseRoute.initialRoute)
      } finally {
        setIsStarting(false)
      }
    }

    startTopic()
  }, [dispatch, id, navigate])

  const handleSubmitAnswers = async (answers) => {
    try {
      // Submit answers to update spaced repetition data
      const submitResult = await dispatch(submitExerciseProgress(id, answers))

      // Store result to show result view
      setResult(submitResult)
    } catch (error) {
      console.error('Failed to submit answers:', error)
      alert('Gagal menyimpan progress: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const handleBackToTopicList = () => {
    // Navigate back to list
    navigate(ExerciseRoute.initialRoute)
  }

  return {
    topicSnapshot,
    isStarting,
    result,
    handleSubmitAnswers,
    handleBackToTopicList
  }
}
