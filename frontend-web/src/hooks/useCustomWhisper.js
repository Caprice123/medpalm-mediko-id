import { useEffect, useState, useRef } from "react"

export const useCustomWhisper = (
  useNova,
  onTranscriptComplete,
  autoSendEnabled = false,
  onAutoSend = null,
  onError = null
) => {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState({ text: '' })
  const [initialLoad, setInitialLoad] = useState(true)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)
  const processedTranscriptRef = useRef('') // Track last processed transcript to prevent duplicates
  const previousTranscribingRef = useRef(false) // Track previous transcribing state

  // Helper to handle errors
  const handleError = (message, code = 'WHISPER_ERROR') => {
    const errorObj = { message, code }
    console.error(`❌ ${code}:`, message)
    if (onError) {
      onError(errorObj)
    }
  }

  // Start recording function
  const startRecording = async () => {
    try {
      // Reset transcript and processed tracker
      setTranscript({ text: '' })
      processedTranscriptRef.current = ''

      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setRecording(false)

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })

        // Check if audio is too small (likely silent or very short)
        // Typical silent/empty webm is less than 1000 bytes
        if (audioBlob.size < 1000) {
          setInitialLoad(false)
          handleError("Audio terlalu pendek atau tidak terdeteksi. Coba berbicara lebih lama.", 'AUDIO_TOO_SHORT')
          return
        }

        setTranscribing(true)

        // Send to Whisper
        try {
          const formData = new FormData()
          formData.append('file', audioBlob, 'audio.webm')
          formData.append('model', 'whisper-1')
          formData.append('language', 'id')

          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: formData
          })

          if (!response.ok) {
            const errorText = await response.text()
            throw new Error(`API error: ${response.status} - ${errorText}`)
          }

          const result = await response.json()
          setTranscript({ text: result.text })
          setTranscribing(false)
          setInitialLoad(false)
        } catch (err) {
          console.error('❌ Transcription error:', err)
          handleError(`Failed to transcribe: ${err.message}`, 'WHISPER_TRANSCRIPTION_ERROR')
          setTranscribing(false)
          setInitialLoad(false)
        }
      }

      // Start recording
      mediaRecorder.start()
      setRecording(true)

    } catch (err) {
      console.error('❌ Error starting recording:', err)
      handleError(`Failed to start recording: ${err.message}`, 'WHISPER_START_ERROR')
    }
  }

  // Stop recording function
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  // Toggle recording
  const toggleRecording = async () => {
    if (recording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }

  // Handle transcript completion
  useEffect(() => {
    if (useNova) {
      previousTranscribingRef.current = transcribing
      return
    }

    // Detect when transcription just finished (transition from true to false)
    const justFinishedTranscribing = previousTranscribingRef.current && !transcribing

    // Only use Whisper transcript when Nova is not available
    if (!transcribing && transcript.text && transcript.text.trim()) {
      const newText = transcript.text.trim()

      // Check if we've already processed this transcript to prevent duplicates
      if (processedTranscriptRef.current !== newText) {
        processedTranscriptRef.current = newText

        if (onTranscriptComplete) {
          onTranscriptComplete(newText)
        }

        // Auto-send when transcription is complete (only for Whisper)
        if (autoSendEnabled && onAutoSend && !recording) {
          onAutoSend(newText)
        }
      }
    } else if (justFinishedTranscribing && !transcript.text) {
      // Only show empty error when transcription JUST finished with no result
      handleError("Audio tidak terdengar dengan jelas. Pastikan Anda berbicara dekat dengan mikrofon.", 'EMPTY_TRANSCRIPTION')
    }

    // Update previous transcribing state
    previousTranscribingRef.current = transcribing
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
