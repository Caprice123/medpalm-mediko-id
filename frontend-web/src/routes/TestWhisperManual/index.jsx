import { useState, useRef } from 'react'

async function isAudioSilent(blob, threshold = 0.01) {
  const arrayBuffer = await blob.arrayBuffer()
  const audioCtx = new AudioContext()
  const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer)

  const channelData = audioBuffer.getChannelData(0)
  let sum = 0
  for (let i = 0; i < channelData.length; i++) {
    sum += Math.abs(channelData[i])
  }

  const average = sum / channelData.length
  console.log("🔊 Average volume:", average)

  await audioCtx.close()
  return average < threshold
}

const TestWhisperManual = () => {
  const [recording, setRecording] = useState(false)
  const [transcribing, setTranscribing] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState('')

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const streamRef = useRef(null)

  const startRecording = async () => {
    try {
      console.log('🎤 Starting manual recording...')
      setError('')

      // Get microphone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      console.log('✅ Got microphone stream')

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
          console.log('🎵 Audio chunk received:', event.data.size, 'bytes')
        }
      }

      mediaRecorder.onstop = async () => {
        console.log('🛑 Recording stopped')
        setRecording(false)
        setTranscribing(true)

        // Create audio blob
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        console.log('📦 Audio blob created:', audioBlob.size, 'bytes')

        // 🔇 Check for silence before sending
        const silent = await isAudioSilent(audioBlob)
        if (silent) {
            console.log("🤫 Silent audio detected, skipping transcription")
            setTranscript("(No speech detected)")
            setTranscribing(false)
            return
        }

        // Send to Whisper
        try {
          const formData = new FormData()
          formData.append('file', audioBlob, 'audio.webm')
          formData.append('model', 'whisper-1')
          formData.append('temperature', '0')
          formData.append('language', 'id')

          console.log('📤 Sending to Whisper API...')
          const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
            },
            body: formData
          })

          if (!response.ok) {
            throw new Error(`API error: ${response.status}`)
          }

          const result = await response.json()
          console.log('✅ Transcription:', result.text)
          setTranscript(result.text)
          setTranscribing(false)
        } catch (err) {
          console.error('❌ Transcription error:', err)
          setError(err.message)
          setTranscribing(false)
        }
      }

      // Start recording
      mediaRecorder.start()
      setRecording(true)
      console.log('✅ Recording started')

    } catch (err) {
      console.error('❌ Error starting recording:', err)
      setError(err.message)
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Test Whisper - Manual Implementation</h1>

      <div style={{ marginBottom: '20px', padding: '15px', background: '#f5f5f5', borderRadius: '8px' }}>
        <p><strong>Recording:</strong> {recording ? '🔴 Yes' : '⚪ No'}</p>
        <p><strong>Transcribing:</strong> {transcribing ? '⏳ Yes' : '✅ No'}</p>
        <p><strong>API Key:</strong> {import.meta.env.VITE_OPENAI_API_KEY ? '✅ Set' : '❌ Not set'}</p>
      </div>

      {error && (
        <div style={{ marginBottom: '20px', padding: '15px', background: '#ffebee', borderRadius: '8px', color: '#c62828' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      <div style={{ marginBottom: '20px', padding: '15px', background: '#e3f2fd', borderRadius: '8px' }}>
        <h3>Transcript:</h3>
        <p style={{ minHeight: '50px', padding: '10px', background: 'white', borderRadius: '4px' }}>
          {transcript || '(No transcript yet)'}
        </p>
      </div>

      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={startRecording}
          disabled={recording || transcribing}
          style={{
            padding: '10px 20px',
            background: (recording || transcribing) ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: (recording || transcribing) ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          disabled={!recording}
          style={{
            padding: '10px 20px',
            background: !recording ? '#ccc' : '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: !recording ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          Stop Recording
        </button>
      </div>

      <div style={{ marginTop: '20px', padding: '10px', background: '#fff3cd', borderRadius: '4px' }}>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>Note:</strong> This uses manual MediaRecorder + OpenAI API (no library).
          Check browser console (F12) for detailed logs.
        </p>
      </div>
    </div>
  )
}

export default TestWhisperManual
