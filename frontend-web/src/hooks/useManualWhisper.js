import { useState, useRef, useCallback } from 'react'

export const useManualWhisper = (
  useNova,
  onTranscriptComplete,
  autoSendEnabled = false,
  onAutoSend = null,
  onError = null
) => {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState({ text: '' })

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const handleError = (message, code = 'WHISPER_ERROR') => {
    const errorObj = { message, code }
    if (onError) {
      onError(errorObj)
    }
  }

  const startRecording = useCallback(async () => {
    try {
      console.log('🎤 Manual Whisper: Starting recording...')

      // Get microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      // Collect audio chunks
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped, transcribing...')
        setRecording(false)
        setTranscribing(true)

        try {
          // Create audio blob
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          console.log('📦 Audio blob size:', audioBlob.size, 'bytes')

          // Send to OpenAI Whisper API
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
            throw new Error(`Whisper API error: ${response.status}`)
          }

          const result = await response.json()
          const transcriptText = result.text?.trim() || ''

          console.log('✅ Transcription result:', transcriptText)

          setTranscript({ text: transcriptText })
          setTranscribing(false)

          // Call callbacks
          if (transcriptText) {
            if (onTranscriptComplete) {
              onTranscriptComplete(transcriptText)
            }
            if (autoSendEnabled && onAutoSend) {
              onAutoSend(transcriptText)
            }
          } else {
            handleError('Audio tidak terdengar dengan jelas. Pastikan Anda berbicara dekat dengan mikrofon.', 'EMPTY_TRANSCRIPTION')
          }

        } catch (error) {
          console.error('❌ Transcription error:', error)
          setTranscribing(false)
          handleError(`Gagal mentranskrip audio: ${error.message}`, 'TRANSCRIPTION_ERROR')
        }

        // Clean up
        audioChunksRef.current = []
      }

      // Start recording
      mediaRecorder.start()
      setRecording(true)
      console.log('✅ Recording started')

    } catch (error) {
      console.error('❌ Error starting recording:', error)
      handleError(`Gagal memulai rekaman: ${error.message}`, 'START_RECORDING_ERROR')
    }
  }, [autoSendEnabled, onAutoSend, onTranscriptComplete, onError])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
  }, [])

  const toggleRecording = useCallback(async () => {
    console.log('🎤 Manual Whisper toggleRecording - recording:', recording)

    if (recording) {
      stopRecording()
    } else {
      await startRecording()
    }
  }, [recording, startRecording, stopRecording])

  return {
    recording,
    transcribing,
    transcript,
    toggleRecording,
    startRecording,
    stopRecording
  }
}
