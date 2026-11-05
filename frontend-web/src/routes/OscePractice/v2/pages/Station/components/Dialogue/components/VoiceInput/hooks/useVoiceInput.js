import { useState, useEffect, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import { useRecording } from '@hooks/useRecording'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'
import { actions as commonActions } from '@store/common/reducer'
import { updateSessionMetadata } from '@store/oscePractice/userAction'
import { primeBell } from '../../../../../utils/bell'

const AUTO_SEND_STORAGE_KEY = 'osce_auto_send_enabled'

const readAutoSend = () => {
  try {
    return localStorage.getItem(AUTO_SEND_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

const writeAutoSend = (value) => {
  try {
    localStorage.setItem(AUTO_SEND_STORAGE_KEY, String(value))
  } catch {
    // The preference just does not survive this session.
  }
}

// The composer: typing, recording, transcribing, and sending.
//
// Auto-send is owned here because the switch that governs it now sits in this same component.
// V1 kept the switch in the sidebar and had the input poll localStorage every 500ms to notice
// changes; the preference is still persisted, but nothing polls it any more.
export const useVoiceInput = ({ onSend, disabled }) => {
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const entryRef = useRef(null)

  // The provider was already chosen and recorded when the station was started, so the room
  // reads it off the session rather than re-running the connectivity test on every entry.
  const recordedProvider = useSelector(
    (state) => state.oscePractice.sessionDetail?.metadata?.sttProvider,
  )

  const [text, setText] = useState('')
  const [heard, setHeard] = useState('')
  const [autoSend, setAutoSend] = useState(readAutoSend)
  const [provider, setProvider] = useState(recordedProvider || null)

  useEffect(() => {
    if (recordedProvider) {
      setProvider(recordedProvider)
      return
    }

    // Only a session started before the provider was being recorded reaches this: fall back to
    // testing once, rather than silently transcribing on the wrong service.
    let cancelled = false
    getAvailableSttProvider()
      .then((resolved) => { if (!cancelled) setProvider(resolved) })
      .catch(() => { if (!cancelled) setProvider('whisper') })

    return () => { cancelled = true }
  }, [recordedProvider])

  const toggleAutoSend = useCallback(() => {
    setAutoSend((current) => {
      writeAutoSend(!current)
      return !current
    })
  }, [])

  // Deepgram can fall back to Whisper mid-session; the session's metadata records which one
  // actually transcribed it, so a later review knows what the text came from.
  const handleProviderChange = useCallback((next) => {
    setProvider(next)
    if (sessionId) dispatch(updateSessionMetadata(sessionId, { sttProvider: next }))
  }, [dispatch, sessionId])

  const handleInterim = useCallback((interim) => setHeard(interim), [])

  // A finished phrase is appended rather than replacing: a student often records one sentence,
  // thinks, then records another before sending.
  const handleFinal = useCallback((final) => {
    setHeard('')
    setText((previous) => {
      const before = previous?.trim() || ''
      const after = final?.trim() || ''
      if (before && after) return `${before} ${after}`
      return after || before
    })
  }, [])

  const handleError = useCallback((error) => {
    dispatch(commonActions.setError(error))
  }, [dispatch])

  const send = useCallback((candidate) => {
    const message = (typeof candidate === 'string' && candidate.trim())
      ? candidate.trim()
      : text.trim()

    if (!message || disabled) return

    setText('')
    setHeard('')
    onSend(message)
  }, [text, disabled, onSend])

  const recording = useRecording(
    handleInterim,
    handleFinal,
    autoSend,
    autoSend ? send : null,
    handleError,
    provider || 'whisper',
    handleProviderChange,
  )

  // Focus returns to the field the moment the patient has finished answering, so the student
  // can keep typing without reaching for the mouse.
  useEffect(() => {
    if (!disabled) entryRef.current?.focus()
  }, [disabled])

  // Grow with the text up to the CSS max-height, then scroll. Measured from scrollHeight
  // after collapsing to auto, which is the only way to read the shrunk size too — without
  // the reset the field can grow but never come back down after a send.
  useEffect(() => {
    const entry = entryRef.current
    if (!entry) return

    entry.style.height = 'auto'
    entry.style.height = `${entry.scrollHeight}px`
  }, [text, heard])

  const toggleRecording = useCallback(() => {
    if (!recording.isRecording) {
      setText('')
      setHeard('')
    }
    // Pressing the mic is a user gesture, which is exactly what the browser wants before the
    // station bell is allowed to make a sound later.
    primeBell()
    recording.toggleRecording()
  }, [recording])

  const handleKeyDown = useCallback((event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      send()
    }
  }, [send])

  return {
    entryRef,
    text,
    setText,
    heard,
    autoSend,
    toggleAutoSend,
    recording,
    send,
    toggleRecording,
    handleKeyDown,
  }
}
