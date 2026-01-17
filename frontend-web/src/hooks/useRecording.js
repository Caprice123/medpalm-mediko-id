import { useEffect, useState, useCallback } from 'react'
import { useDeepgram } from './useDeepgram'
import { useCustomWhisper } from './useCustomWhisper'

/**
 * A wrapper hook that uses Deepgram for real-time transcription first,
 * and falls back to Whisper if Deepgram is unavailable or fails.
 *
 * @param {Function} onTranscriptUpdate - Called when interim transcript updates (Deepgram only)
 * @param {Function} onTranscriptFinal - Called when final transcript is available
 * @param {boolean} autoSendEnabled - Whether to auto-send transcript when recording stops
 * @param {Function} onAutoSend - Called when auto-send is triggered
 * @param {Function} onError - Called when an error occurs (for Redux error handling)
 * @returns {Object} Recording controls and state
 */
export const useRecording = (
  onTranscriptUpdate = null,
  onTranscriptFinal = null,
  autoSendEnabled = false,
  onAutoSend = null,
  onError = null
) => {
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('')
  const [usingWhisper, setUsingWhisper] = useState(false)

  // Deepgram hook (primary)
  const deepgram = useDeepgram(
    onTranscriptUpdate,
    (text) => {
      setAccumulatedTranscript(prev => prev + text)
      if (onTranscriptFinal) {
        onTranscriptFinal(text)
      }
    },
    autoSendEnabled,
    onAutoSend,
    onError
  )

  // Whisper hook (fallback)
  const whisper = useCustomWhisper(
    deepgram.useNova,
    (text) => {
      setAccumulatedTranscript(text)
      if (onTranscriptFinal) {
        onTranscriptFinal(text)
      }
    },
    autoSendEnabled,
    onAutoSend,
    onError
  )

  // Monitor Deepgram availability and switch to Whisper if needed
  useEffect(() => {
    if (!deepgram.useNova && !usingWhisper) {
      setUsingWhisper(true)
      if (onError) {
        onError({
          message: 'Beralih ke mode transkripsi Whisper (non-realtime)',
          code: 'FALLBACK_TO_WHISPER'
        })
      }
    }
  }, [deepgram.useNova, usingWhisper, onError])

  // Unified toggle function
  const toggleRecording = useCallback(() => {
    if (deepgram.useNova) {
      deepgram.toggleListening()
    } else {
      whisper.toggleRecording()
    }
  }, [deepgram.useNova, deepgram.toggleListening, whisper.toggleRecording])

  // Start recording
  const startRecording = useCallback(() => {
    setAccumulatedTranscript('')
    if (deepgram.useNova) {
      deepgram.startListening()
    } else {
      whisper.startRecording()
    }
  }, [deepgram.useNova, deepgram.startListening, whisper.startRecording])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (deepgram.useNova) {
      deepgram.stopListening()
    } else {
      whisper.stopRecording()
    }
  }, [deepgram.useNova, deepgram.stopListening, whisper.stopRecording])

  // Determine if recording is active
  const isRecording = deepgram.useNova ? deepgram.isListening : whisper.recording

  // Determine current transcript
  const currentTranscript = deepgram.useNova
    ? (deepgram.transcript || accumulatedTranscript)
    : accumulatedTranscript

  // Get current status
  const status = deepgram.useNova
    ? deepgram.connectionStatus
    : (whisper.transcribing ? 'transcribing' : whisper.recording ? 'recording' : 'disconnected')

  // Get current error
  const currentError = deepgram.useNova ? deepgram.error : null

  return {
    // State
    isRecording,
    transcript: currentTranscript,
    finalTranscript: deepgram.useNova ? deepgram.finalTranscript : accumulatedTranscript,
    status,
    error: currentError,
    usingDeepgram: deepgram.useNova,
    usingWhisper: !deepgram.useNova,
    isTranscribing: deepgram.useNova ? false : whisper.transcribing,

    // Actions
    toggleRecording,
    startRecording,
    stopRecording,
  }
}
