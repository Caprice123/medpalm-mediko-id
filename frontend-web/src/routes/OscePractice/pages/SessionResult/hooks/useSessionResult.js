import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages,
} from '@store/oscePractice/userAction'
import { OscePracticeRoute } from '../../../routes'

export const useSessionResult = () => {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)
  const [activeTab, setActiveTab] = useState('hasil')
  const [error, setError] = useState(null)

  useEffect(() => {
    if (sessionId) {
      Promise.all([
        dispatch(fetchSessionDetail(sessionId)),
        dispatch(fetchSessionMessages(sessionId)),
        dispatch(fetchPhysicalExamMessages(sessionId)),
      ]).catch(err => {
        setError(err.message || 'Gagal memuat detail sesi')
      })
    }
  }, [sessionId, dispatch])

  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.status === 'created') {
        navigate(OscePracticeRoute.preparationRoute(sessionId), { replace: true })
      } else if (sessionDetail.status === 'started') {
        navigate(OscePracticeRoute.practiceRoute(sessionId), { replace: true })
      }
    }
  }, [sessionDetail, sessionId, navigate])

  const handleBack = () => navigate(OscePracticeRoute.moduleRoute)

  return { sessionId, sessionDetail, loading, activeTab, setActiveTab, error, handleBack }
}
