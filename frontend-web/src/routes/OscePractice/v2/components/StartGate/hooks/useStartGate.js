import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createOsceSession, startOsceSession } from '@store/oscePractice/userAction'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'
import { OscePracticeRoute } from '@routes/OscePractice/routes'

// The checks V1 spent a whole page on, as a gate the board raises in place.
//
// Both checks are a property of the browser, not of the station, so they run as soon as the
// gate opens rather than on a button: by the time the student has read the task card, the
// answer is usually already there.
export const useStartGate = (target, { onClose }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [microphoneGranted, setMicrophoneGranted] = useState(false)
  const [isRequestingMicrophone, setIsRequestingMicrophone] = useState(false)
  const [microphoneError, setMicrophoneError] = useState(null)
  const [sttProvider, setSttProvider] = useState(null)
  const [isTestingProvider, setIsTestingProvider] = useState(false)

  const isOpen = !!target

  useEffect(() => {
    if (!isOpen) return

    let cancelled = false

    const check = async () => {
      setMicrophoneError(null)

      // `permissions.query` is not in every browser; a rejection here only means the answer is
      // unknown, so the gate falls back to asking rather than claiming the mic is blocked.
      try {
        const permission = await navigator.permissions.query({ name: 'microphone' })
        if (!cancelled) setMicrophoneGranted(permission.state === 'granted')
      } catch {
        if (!cancelled) setMicrophoneGranted(false)
      }

      setIsTestingProvider(true)
      try {
        const provider = await getAvailableSttProvider()
        if (!cancelled) setSttProvider(provider)
      } catch {
        // Whisper is the fallback transcriber; the station is still workable on it.
        if (!cancelled) setSttProvider('whisper')
      } finally {
        if (!cancelled) setIsTestingProvider(false)
      }
    }

    check()

    return () => { cancelled = true }
  }, [isOpen])

  const requestMicrophone = useCallback(async () => {
    setIsRequestingMicrophone(true)
    setMicrophoneError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      // Release the device straight away: holding it open here would leave the recording
      // indicator on while the student is still reading the task card.
      stream.getTracks().forEach((track) => track.stop())
      setMicrophoneGranted(true)
    } catch {
      setMicrophoneError('Akses mikrofon ditolak. Aktifkan izin mikrofon untuk situs ini di pengaturan browser, lalu coba lagi.')
    } finally {
      setIsRequestingMicrophone(false)
    }
  }, [])

  // Start, from either entry point: a station that has no session yet gets one created first,
  // a session that already exists only needs starting.
  const start = useCallback(async () => {
    if (!target || !microphoneGranted || !sttProvider) return

    const enterRoom = (sessionUniqueId) => {
      onClose()
      navigate(OscePracticeRoute.practiceRoute(sessionUniqueId))
    }

    if (target.kind === 'session') {
      await dispatch(startOsceSession(target.session.uniqueId, sttProvider, () => {
        enterRoom(target.session.uniqueId)
      }))
      return
    }

    await dispatch(createOsceSession(target.station.uniqueId, async (session) => {
      await dispatch(startOsceSession(session.uniqueId, sttProvider, () => {
        enterRoom(session.uniqueId)
      }))
    }))
  }, [dispatch, navigate, onClose, target, microphoneGranted, sttProvider])

  return {
    microphoneGranted,
    isRequestingMicrophone,
    microphoneError,
    sttProvider,
    isTestingProvider,
    requestMicrophone,
    start,
  }
}
