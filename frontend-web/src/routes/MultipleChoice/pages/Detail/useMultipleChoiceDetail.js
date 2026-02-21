import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMcqTopicById } from '@store/mcq/userAction'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { MultipleChoiceRoute } from '../../routes'

export const useMultipleChoiceDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'quiz'

  const { currentTopic, loading } = useSelector(state => state.mcq)
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    setQuizResult(null)
    dispatch(tagActions.updateFilter({ key: 'tagGroupNames', value: ['department', 'topic', 'university', 'semester'] }))
    dispatch(fetchTags())
    dispatch(fetchMcqTopicById(id))
  }, [dispatch, id])

  const handleBack = () => navigate(MultipleChoiceRoute.moduleRoute)

  return {
    id,
    currentTopic,
    loading,
    mode,
    quizResult,
    setQuizResult,
    handleBack
  }
}
