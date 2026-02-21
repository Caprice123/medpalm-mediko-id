import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { startFlashcardDeck, submitFlashcardProgress } from '@store/session/action'
import { fetchTags } from '@store/tags/userAction'
import { actions as tagActions } from '@store/tags/reducer'
import { FlashcardRoute } from '../../routes'

export const useFlashcardDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const { topicSnapshot, loading } = useSelector(state => state.session)
  const isStarting = loading.isStartingFlashcard

  useEffect(() => {
    const startDeck = async () => {
        dispatch(tagActions.updateFilter({ key: "tagGroupNames", value: ["department", "topic", "university", "semester"]}))
        dispatch(fetchTags())
        await dispatch(startFlashcardDeck(id))
    }

    startDeck()
  }, [dispatch, id, navigate])

  const handleSubmitAnswers = async (answers) => {
    await dispatch(submitFlashcardProgress(id, answers))
    navigate(FlashcardRoute.initialRoute)
  }

  const handleBackToDeckList = () => {
    navigate(FlashcardRoute.initialRoute)
  }

  return {
    topicSnapshot,
    isStarting,
    handleSubmitAnswers,
    handleBackToDeckList
  }
}
