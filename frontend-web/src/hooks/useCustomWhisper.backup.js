import { useEffect, useState } from "react"
import useWhisper from "@chengsokdara/use-whisper"
import { setTimeout, setInterval, clearTimeout, clearInterval } from 'worker-timers'

export const useCustomWhisper = (
  useNova,
  onTranscriptComplete,
  autoSendEnabled = false,
  onAutoSend = null,
  onError = null
) => {
  const [initialLoad, setInitialLoad] = useState(true)

  // Helper to handle errors with common reducer
  const handleError = (message, code = 'WHISPER_ERROR') => {
    const errorObj = { message, code }
    if (onError) {
      onError(errorObj)
    }
  }

  // Initialize Whisper as fallback (non-streaming mode)
  const {
    recording,
    speaking,
    transcribing,
    transcript,
    pauseRecording,
    startRecording,
    stopRecording,
  } = useWhisper({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    whisperConfig: {
      language: "id",
      model: "whisper-1",
    },
    removeSilence: true,
    streaming: false, // Use non-streaming mode for fallback
  })

  // Toggle Whisper recording
  const toggleRecording = async () => {
    console.log('🎤 Whisper toggleRecording - useNova:', useNova, 'recording:', recording)

    if (recording) {
      console.log('🛑 Stopping Whisper recording')
      stopRecording()
    } else {
      console.log('▶️ Starting Whisper recording...')
      console.log('📝 API Key exists:', !!import.meta.env.VITE_OPENAI_API_KEY)
      console.log('🔍 API Key value:', import.meta.env.VITE_OPENAI_API_KEY?.substring(0, 10) + '...')

      // Check microphone permissions
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' })
        console.log('🎤 Microphone permission:', permissionStatus.state)
      } catch (e) {
        console.warn('Could not check microphone permission:', e)
      }

      // Check MediaRecorder support
      console.log('🎙️ MediaRecorder supported:', !!window.MediaRecorder)

      try {
        console.log('🔄 Calling startRecording()...')
        const result = await startRecording()
        console.log('✅ startRecording() returned:', result)

        // Wait a bit and check recording state
        setTimeout(() => {
          console.log('⏱️ After 500ms - recording state:', recording)
        }, 500)

        setInitialLoad(false)
      } catch (error) {
        console.error('❌ Error calling startRecording():', error)
        handleError(`Failed to start recording: ${error.message}`, 'WHISPER_START_ERROR')
      }
    }
  }

  // Log when recording state changes
  useEffect(() => {
    console.log('🔄 Whisper recording state changed:', recording)
  }, [recording])

  // Log when transcribing state changes
  useEffect(() => {
    console.log('🔄 Whisper transcribing state changed:', transcribing)
  }, [transcribing])

  useEffect(() => {
    console.log('📊 Whisper useEffect - useNova:', useNova, 'recording', recording, 'transcribing:', transcribing, 'transcript:', transcript.text)

    if (useNova) {
      console.log('⏸️ Skipping Whisper processing - Deepgram is active (useNova=true)')
      return
    }

    // Only use Whisper transcript when Nova is not available
    if (!transcribing && transcript.text && transcript.text.trim()) {
      const newText = transcript.text.trim()
      console.log('✅ Whisper transcript ready:', newText)

      if (onTranscriptComplete) {
        onTranscriptComplete(newText)
      }

      // Auto-send when transcription is complete (only for Whisper)
      if (autoSendEnabled && onAutoSend && !recording) {
        onAutoSend(newText)
      }
    } else if (!transcribing && !initialLoad && !transcript.text) {
      // Show message when transcription completed but empty
      console.log('⚠️ Whisper transcription completed but empty')
      handleError("Audio tidak terdengar dengan jelas. Pastikan Anda berbicara dekat dengan mikrofon.", 'EMPTY_TRANSCRIPTION')
    }
  }, [useNova, transcript, transcribing, recording, autoSendEnabled, onAutoSend, onTranscriptComplete, initialLoad])

  return {
    recording,
    transcribing,
    transcript,
    toggleRecording,
    startRecording,
    stopRecording
  }
}
