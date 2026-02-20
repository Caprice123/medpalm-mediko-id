import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { startOsceSession, fetchSessionDetail } from '@store/oscePractice/userAction'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'
import { OscePracticeRoute } from '../../../routes'

export const useSessionPreparation = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const { sessionDetail, loading } = useSelector(state => state.oscePractice)

  const [microphoneGranted, setMicrophoneGranted] = useState(false)
  const [isRequesting, setIsRequesting] = useState(false)
  const [permissionError, setPermissionError] = useState(null)
  const [sttProvider, setSttProvider] = useState(null)
  const [testingProvider, setTestingProvider] = useState(false)

  useEffect(() => {
    if (sessionId) {
      dispatch(fetchSessionDetail(sessionId))
    }
  }, [sessionId, dispatch])

  useEffect(() => {
    checkPermissions()
  }, [])

  useEffect(() => {
    const testProvider = async () => {
      setTestingProvider(true)
      try {
        const provider = await getAvailableSttProvider()
        setSttProvider(provider)
      } catch (err) {
        console.error('Error testing STT provider:', err)
        setSttProvider('whisper')
      } finally {
        setTestingProvider(false)
      }
    }
    testProvider()
  }, [])

  const checkPermissions = async () => {
    try {
      const micPermission = await navigator.permissions.query({ name: 'microphone' })
      setMicrophoneGranted(micPermission.state === 'granted')
    } catch (err) {
      console.error('Error checking permissions:', err)
    }
  }

  const requestMicrophonePermission = async () => {
    setIsRequesting(true)
    setPermissionError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach(track => track.stop())
      setMicrophoneGranted(true)
    } catch (err) {
      console.error('Permission denied:', err)
      setPermissionError('Akses mikrofon ditolak. Silakan aktifkan izin mikrofon di pengaturan browser Anda.')
    } finally {
      setIsRequesting(false)
    }
  }

  const handleStart = async () => {
    if (!microphoneGranted) {
      setPermissionError('Harap berikan izin akses mikrofon terlebih dahulu.')
      return
    }
    if (!sttProvider) {
      setPermissionError('Sedang memeriksa konektivitas layanan. Mohon tunggu sebentar.')
      return
    }
      await dispatch(startOsceSession(sessionId, sttProvider, () => {
        navigate(OscePracticeRoute.practiceRoute(sessionId))
      }))
  }

  const handleCancel = () => {
    navigate(OscePracticeRoute.moduleRoute)
  }

  const handleBackToHome = () => {
    navigate(OscePracticeRoute.moduleRoute)
  }

  return {
    sessionDetail, loading,
    microphoneGranted, isRequesting, permissionError,
    sttProvider, testingProvider,
    requestMicrophonePermission, handleStart, handleCancel, handleBackToHome,
  }
}
