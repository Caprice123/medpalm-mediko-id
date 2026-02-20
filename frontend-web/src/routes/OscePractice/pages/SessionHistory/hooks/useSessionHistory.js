import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { fetchUserOsceSessions } from '@store/oscePractice/userAction'
import { actions } from '@store/oscePractice/reducer'
import { OscePracticeRoute } from '../../../routes'

export const useSessionHistory = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { userSessions, loading, sessionsPagination } = useSelector(state => state.oscePractice)

  useEffect(() => {
    dispatch(fetchUserOsceSessions())
  }, [dispatch])

  const handleStartPractice = () => {
    navigate(OscePracticeRoute.topicsRoute)
  }

  const handlePageChange = (page) => {
    dispatch(actions.setSessionsPage(page))
    dispatch(fetchUserOsceSessions())
  }

  return { userSessions, loading, sessionsPagination, handleStartPractice, handlePageChange }
}
