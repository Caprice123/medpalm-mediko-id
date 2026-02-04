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
 * @param {string} sttProvider - STT provider to use: 'deepgram' or 'whisper'
 * @param {Function} onProviderChange - Called when provider changes (e.g., fallback from deepgram to whisper)
 * @returns {Object} Recording controls and state
 */
export const useRecording = (
  onTranscriptUpdate = null,
  onTranscriptFinal = null,
  autoSendEnabled = false,
  onAutoSend = null,
  onError = null,
  sttProvider = 'deepgram',
  onProviderChange = null
) => {
  const [accumulatedTranscript, setAccumulatedTranscript] = useState('')
  const [currentProvider, setCurrentProvider] = useState(sttProvider)

  // Sync currentProvider with sttProvider prop changes
  useEffect(() => {
    setCurrentProvider(sttProvider)
  }, [sttProvider])

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
    currentProvider === 'whisper' ? false : deepgram.useNova,
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

  // Unified toggle function
  const toggleRecording = useCallback(async () => {
    // If provider is whisper, use whisper directly
    if (currentProvider === 'whisper') {
      whisper.toggleRecording()
      return
    }

    // If provider is deepgram
    if (deepgram.useNova && currentProvider === 'deepgram') {
      if (deepgram.isListening) {
        // If already recording, just stop
        deepgram.stopListening()
      } else {
        // If starting, handle potential Deepgram failure
        try {
          await deepgram.startListening()
          // If startListening completes but useNova was set to false (connection failed)
          // automatically retry with Whisper
          if (!deepgram.useNova) {
            setCurrentProvider('whisper')
            if (onProviderChange) {
              onProviderChange('whisper')
            }
            whisper.startRecording()
          }
        } catch (error) {
          // If Deepgram fails, automatically try Whisper
          setCurrentProvider('whisper')
          if (onProviderChange) {
            onProviderChange('whisper')
          }
          whisper.startRecording()
        }
      }
    } else {
      // Fallback to Whisper
      whisper.toggleRecording()
    }
  }, [currentProvider, deepgram, whisper, onProviderChange])

  // Start recording
  const startRecording = useCallback(async () => {
    setAccumulatedTranscript('')

    // If provider is whisper, use whisper directly
    if (currentProvider === 'whisper') {
      whisper.startRecording()
      return
    }

    // If provider is deepgram, try deepgram first
    if (deepgram.useNova && currentProvider === 'deepgram') {
      try {
        await deepgram.startListening()
        // If startListening completes but useNova was set to false (connection failed)
        // automatically retry with Whisper
        if (!deepgram.useNova) {
          setCurrentProvider('whisper')
          if (onProviderChange) {
            onProviderChange('whisper')
          }
          whisper.startRecording()
        }
      } catch (error) {
        // If Deepgram fails, automatically try Whisper
        setCurrentProvider('whisper')
        if (onProviderChange) {
          onProviderChange('whisper')
        }
        whisper.startRecording()
      }
    } else {
      // Fallback to Whisper
      whisper.startRecording()
    }
  }, [currentProvider, deepgram, whisper, onProviderChange])

  // Stop recording
  const stopRecording = useCallback(() => {
    if (currentProvider === 'deepgram' && deepgram.useNova) {
      deepgram.stopListening()
    } else {
      whisper.stopRecording()
    }
  }, [currentProvider, deepgram.useNova, deepgram.stopListening, whisper.stopRecording])

  // Determine if recording is active based on current provider
  const isRecording = currentProvider === 'deepgram' && deepgram.useNova
    ? deepgram.isListening
    : whisper.recording

  // Determine current transcript
  const currentTranscript = currentProvider === 'deepgram' && deepgram.useNova
    ? (deepgram.transcript || accumulatedTranscript)
    : accumulatedTranscript

  // Get current status
  const status = currentProvider === 'deepgram' && deepgram.useNova
    ? deepgram.connectionStatus
    : (whisper.transcribing ? 'transcribing' : whisper.recording ? 'recording' : 'disconnected')

  // Get current error
  const currentError = currentProvider === 'deepgram' && deepgram.useNova ? deepgram.error : null

  return {
    // State
    isRecording,
    transcript: currentTranscript,
    finalTranscript: currentProvider === 'deepgram' && deepgram.useNova ? deepgram.finalTranscript : accumulatedTranscript,
    status,
    error: currentError,
    usingDeepgram: currentProvider === 'deepgram' && deepgram.useNova,
    usingWhisper: currentProvider === 'whisper',
    isTranscribing: currentProvider === 'whisper' ? whisper.transcribing : false,

    // Actions
    toggleRecording,
    startRecording,
    stopRecording,
  }
}
