import { useState, useEffect, useRef } from 'react'
import { createClient } from '@deepgram/sdk'

export const useDeepgram = (onTranscriptUpdate, onTranscriptFinal, autoSendEnabled = false, onAutoSend = null, onError = null) => {
  const [useNova, setUseNova] = useState(true)
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')
  const [error, setError] = useState('')
  const [connectionStatus, setConnectionStatus] = useState('disconnected')

  // Helper to handle errors with common reducer
  const handleError = (message, code = 'RECORDING_ERROR') => {
    const errorObj = { message, code }
    setError(message)
    if (onError) {
      onError(errorObj)
    }
  }

  // Refs for managing connection and media
  const deepgramRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const streamRef = useRef(null)
  const listeningRef = useRef(null)
  const connectionStatusRef = useRef(null)
  const healthCheckRef = useRef(null)

  useEffect(() => {
    listeningRef.current = isListening
  }, [isListening])

  useEffect(() => {
    connectionStatusRef.current = connectionStatus
  }, [connectionStatus])

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      stopListening()
    }
  }, [])

  const initializeDeepgram = async () => {
    try {
      // Get API key from environment variable
      const apiKey = import.meta.env.VITE_DEEPGRAM_API_KEY

      if (!apiKey) {
        throw new Error('Deepgram API key tidak ditemukan')
      }

      // Create Deepgram client
      const deepgramClient = createClient(apiKey)

      // Create live transcription connection
      const connection = deepgramClient.listen.live({
        model: 'nova-2',
        interim_results: true,
        punctuate: true,
        language: 'id'
      })

      // Store connection reference
      deepgramRef.current = connection

      // Add all possible event listeners to catch what's happening
      connection.addListener('open', () => {
        setConnectionStatus('connected')
        setError('')
      })

      connection.addListener('Results', (data) => {
        if (!listeningRef.current) return

        if (data.channel?.alternatives?.[0]?.transcript) {
          const transcriptText = data.channel.alternatives[0].transcript
          if (data.is_final) {
            setFinalTranscript(prev => prev + transcriptText + ' ')
            if (onTranscriptFinal) {
              onTranscriptFinal(transcriptText + ' ')
            }
            setTranscript('') // Clear interim results
          } else {
            setTranscript(transcriptText)
            if (onTranscriptUpdate) {
              onTranscriptUpdate(transcriptText)
            }
          }
        }
      })

      connection.addListener('error', (error) => {
        console.error('Deepgram connection error:', error)
        setUseNova(false)
        setConnectionStatus('error')
        handleError('Gagal terhubung ke layanan Deepgram', 'DEEPGRAM_CONNECTION_ERROR')
      })

      connection.addListener('close', (closeEvent) => {
        // Only set to disconnected if we were previously connected
        if (connectionStatusRef.current === "connected") {
          setConnectionStatus('disconnected')
        }
      })

      return connection

    } catch (err) {
      console.error('Failed to initialize Deepgram:', err)
      handleError(`Gagal menginisialisasi Deepgram: ${err.message}`, 'DEEPGRAM_INIT_ERROR')
      setUseNova(false)
      throw err
    }
  }

  const startListening = async () => {
    try {
      setError('')
      setConnectionStatus('connecting')

      // Check MIME type support first before doing anything else
      let mimeType = null
      if (MediaRecorder.isTypeSupported('audio/webm;codecs=opus')) {
        mimeType = 'audio/webm;codecs=opus'
      } else if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm'
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4'
      }

      if (!mimeType) {
        console.error('No supported audio MIME type found')
        handleError('Browser Anda tidak mendukung format audio yang diperlukan. Coba gunakan Chrome atau Firefox terbaru.', 'UNSUPPORTED_BROWSER')
        setConnectionStatus('error')
        setUseNova(false)
        return
      }

      // Close any existing connection first
      if (deepgramRef.current) {
        try {
          deepgramRef.current.finish()
        } catch (err) {
          // Ignore errors when closing old connection
        }
        deepgramRef.current = null
      }

      // Request microphone access with simpler constraints
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      })

      streamRef.current = stream

      // Initialize Deepgram connection
      const connection = await initializeDeepgram()

      // Wait for connection to be ready with proper verification
      const connectionReady = await new Promise((resolve) => {
        const timeout = setTimeout(() => {
          console.error('Connection timeout - Deepgram tidak dapat terhubung dalam 5 detik')
          resolve(false)
        }, 5000)

        let isResolved = false

        // Listen for open event
        const openHandler = () => {
          if (!isResolved) {
            isResolved = true
            clearTimeout(timeout)
            resolve(true)
          }
        }

        // Listen for error during connection
        const errorHandler = (err) => {
          if (!isResolved) {
            console.error('Deepgram connection error during setup:', err)
            isResolved = true
            clearTimeout(timeout)
            resolve(false)
          }
        }

        connection.addListener('open', openHandler)
        connection.addListener('error', errorHandler)
      })

      // Check if connection was successful
      if (!connectionReady) {
        handleError('Gagal terhubung ke layanan transkripsi. Periksa koneksi internet Anda atau coba lagi.', 'CONNECTION_TIMEOUT')
        setConnectionStatus('error')
        setUseNova(false)
        // Clean up stream since we can't use it
        stream.getTracks().forEach(track => track.stop())
        streamRef.current = null
        return
      }

      // Start health check interval to monitor connection
      healthCheckRef.current = setInterval(() => {
        if (deepgramRef.current) {
          const state = deepgramRef.current.getReadyState()
          // WebSocket states: 0 = CONNECTING, 1 = OPEN, 2 = CLOSING, 3 = CLOSED
          if (state !== 1) {
            console.error('WebSocket connection lost, state:', state)
            handleError('Koneksi terputus. Silakan coba rekam ulang.', 'WEBSOCKET_DISCONNECTED')
            setConnectionStatus('error')
            stopListening()
          }
        }
      }, 1000)

      // Use MediaRecorder with the supported format we detected earlier
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: mimeType,
      })

      mediaRecorderRef.current = mediaRecorder

      // Send audio data to Deepgram
      mediaRecorder.addEventListener('dataavailable', (event) => {
        if (event.data.size > 0) {
          try {
            // Try sending the data
            if (connection && typeof connection.send === 'function') {
              connection.send(event.data)
            } else {
              console.error('Connection.send() is not available or not a function')
            }
          } catch (err) {
            console.error('Error sending audio data:', err)

            // Don't set error state immediately, the connection might recover
            setTimeout(() => {
              if (connectionStatus === 'disconnected') {
                handleError(`Audio streaming error: ${err.message}`, 'AUDIO_STREAMING_ERROR')
              }
            }, 1000)
          }
        }
      })

      mediaRecorder.addEventListener('error', (event) => {
        console.error('MediaRecorder error:', event.error)
        handleError(`Recording error: ${event.error.message}`, 'MEDIA_RECORDER_ERROR')
      })

      // Start recording with frequent data events for real-time processing
      mediaRecorder.start(250) // Send data every 250ms
      setIsListening(true)
      setFinalTranscript('') // Reset final transcript when starting new recording

    } catch (err) {
      console.error('Error starting transcription:', err)
      handleError(`Error: ${err.message}`, 'TRANSCRIPTION_START_ERROR')
      setConnectionStatus('error')
      setUseNova(false)
    }
  }

  const stopListening = () => {
    setIsListening(false)

    // Append any remaining interim transcript
    if (transcript.trim() && onTranscriptFinal) {
      onTranscriptFinal(transcript + ' ')
    }
    setTranscript('')

    // Clear health check interval
    if (healthCheckRef.current) {
      clearInterval(healthCheckRef.current)
      healthCheckRef.current = null
    }

    // Stop MediaRecorder
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
      mediaRecorderRef.current = null
    }

    // Stop media stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }

    // Close Deepgram connection
    if (deepgramRef.current) {
      try {
        deepgramRef.current.finish()
      } catch (err) {
        // Ignore errors when closing
      }
      deepgramRef.current = null
    }

    // Handle auto-send if enabled
    if (autoSendEnabled && onAutoSend && finalTranscript.trim()) {
      onAutoSend(finalTranscript.trim())
    }

    setConnectionStatus('disconnected')
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  return {
    useNova,
    isListening,
    transcript,
    finalTranscript,
    toggleListening,
    startListening,
    stopListening,
    connectionStatus,
    error
  }
}
