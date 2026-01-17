import { useEffect, useState } from "react"
import useWhisper from "@chengsokdara/use-whisper"

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
    if (recording) {
      stopRecording()
    } else {
      startRecording()
      setInitialLoad(false)
    }
  }

  useEffect(() => {
    if (useNova) return
    // Only use Whisper transcript when Nova is not available
    if (!transcribing && transcript.text && transcript.text.trim()) {
      const newText = transcript.text.trim()

      if (onTranscriptComplete) {
        onTranscriptComplete(newText)
      }

      // Auto-send when transcription is complete (only for Whisper)
      if (autoSendEnabled && onAutoSend && !recording) {
        onAutoSend(newText)
      }
    } else if (!transcribing && !initialLoad && !transcript.text) {
      // Show message when transcription completed but empty
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
