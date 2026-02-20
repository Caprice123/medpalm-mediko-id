import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSessionDetail,
  fetchSessionMessages,
  fetchPhysicalExamMessages,
  endOsceSession,
} from '@store/oscePractice/userAction'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'
import { OscePracticeRoute } from '../../../routes'

export const useSessionPractice = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const [activeTab, setActiveTab] = useState('conversation')

  const isPsikiatri = sessionDetail?.tags?.some(tag =>
    tag.tagGroup?.name?.toLowerCase() === 'topic' &&
    tag.name?.toLowerCase() === 'psikiatri'
  ) || false

  const [diagnosisUtama, setDiagnosisUtama] = useState(isPsikiatri ? [] : '')
  const [diagnosisPembanding, setDiagnosisPembanding] = useState([])
  const [therapies, setTherapies] = useState('')
  const [observations, setObservations] = useState([])
  const [interpretations, setInterpretations] = useState({})
  const [showEndSessionModal, setShowEndSessionModal] = useState(false)
  const [isAutoEnd, setIsAutoEnd] = useState(false)
  const [hasFetchedForSession, setHasFetchedForSession] = useState(false)
  const [isTestingSttProvider, setIsTestingSttProvider] = useState(true)
  const [sttProvider, setSttProvider] = useState(null)

  useEffect(() => {
    const testProvider = async () => {
      setIsTestingSttProvider(true)
      try {
        const provider = await getAvailableSttProvider()
        setSttProvider(provider)
      } catch (err) {
        console.error('Error testing STT provider:', err)
        setSttProvider('whisper')
      } finally {
        setIsTestingSttProvider(false)
      }
    }
    testProvider()
  }, [])

  useEffect(() => {
    if (sessionId) {
      setHasFetchedForSession(false)
      Promise.all([
        dispatch(fetchSessionDetail(sessionId)),
        dispatch(fetchSessionMessages(sessionId)),
        dispatch(fetchPhysicalExamMessages(sessionId)),
      ]).then(() => {
        setHasFetchedForSession(true)
      })
    }
  }, [sessionId, dispatch])

  useEffect(() => {
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.userAnswer?.diagnosis) {
        const diagnosis = sessionDetail.userAnswer.diagnosis
        if (Array.isArray(diagnosis.utama)) {
          setDiagnosisUtama(diagnosis.utama)
        } else {
          setDiagnosisUtama(diagnosis.utama || (isPsikiatri ? [] : ''))
        }
        setDiagnosisPembanding(diagnosis.pembanding || [])
      }
      if (sessionDetail.userAnswer?.therapy !== undefined) {
        setTherapies(sessionDetail.userAnswer.therapy || '')
      }
      if (sessionDetail.observationsLocked && sessionDetail.userAnswer?.observations) {
        setObservations(sessionDetail.userAnswer.observations || [])
        const interp = {}
        sessionDetail.userAnswer.observations.forEach(obs => {
          if (obs.notes) interp[obs.snapshotId] = obs.notes
        })
        setInterpretations(interp)
      }
    }
  }, [sessionDetail, sessionId, isPsikiatri])

  useEffect(() => {
    if (loading.isLoadingSessionDetail || !hasFetchedForSession) return
    if (sessionDetail && sessionDetail.uniqueId === sessionId) {
      if (sessionDetail.status === 'created') {
        navigate(OscePracticeRoute.preparationRoute(sessionId), { replace: true })
      } else if (sessionDetail.status === 'completed') {
        navigate(OscePracticeRoute.resultRoute(sessionId), { replace: true })
      }
    }
  }, [sessionDetail, sessionId, navigate, loading.isLoadingSessionDetail, hasFetchedForSession])

  const handleEndSession = (autoEnd = false) => {
    setIsAutoEnd(autoEnd)
    setShowEndSessionModal(true)
  }

  const handleConfirmEndSession = async () => {
    const observationsWithInterpretations = observations.map(obs => ({
      snapshotId: obs.snapshotId,
      name: obs.name,
      interpretation: interpretations[obs.snapshotId] || '',
    }))
    await dispatch(endOsceSession(
      sessionId,
      {
        diagnoses: {
          utama: diagnosisUtama,
          pembanding: diagnosisPembanding,
        },
        therapies,
        observations: observationsWithInterpretations,
      },
      () => {
        navigate(OscePracticeRoute.resultRoute(sessionId))
      }
    ))
  }

  return {
    sessionDetail, loading,
    activeTab, setActiveTab,
    isPsikiatri,
    diagnosisUtama, setDiagnosisUtama,
    diagnosisPembanding, setDiagnosisPembanding,
    therapies, setTherapies,
    observations, setObservations,
    interpretations, setInterpretations,
    showEndSessionModal, setShowEndSessionModal,
    isAutoEnd,
    isTestingSttProvider,
    sttProvider,
    handleEndSession,
    handleConfirmEndSession,
  }
}
