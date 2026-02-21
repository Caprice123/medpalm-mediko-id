import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startExerciseTopic, submitExerciseProgress } from '@store/exercise/userAction'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { ExerciseRoute } from '../../routes'

export const useExerciseDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const detail = useSelector(state => state.exercise.detail)
  const isStarting = useSelector(state => state.exercise.loading.isStartingExercise)

  const [result, setResult] = useState(null)

  useEffect(() => {
    const startTopic = async () => {
        // Load tags for displaying university, semester, department, topic tags
        dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['university', 'semester', 'department', 'topic'] }))
        dispatch(fetchTags())

        await dispatch(startExerciseTopic(id))
    }

    startTopic()
  }, [dispatch, id, navigate])

  const handleSubmitAnswers = async (answers) => {
    await dispatch(submitExerciseProgress(id, answers, (result) => setResult(result)))
  }

  const handleBackToTopicList = () => {
    navigate(ExerciseRoute.initialRoute)
  }

  return {
    topicSnapshot: detail,
    isStarting,
    result,
    handleSubmitAnswers,
    handleBackToTopicList
  }
}
