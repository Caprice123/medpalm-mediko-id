import { useState, memo, useCallback, useEffect } from 'react'
import { useRecording } from '@hooks/useRecording'
import { useDispatch } from 'react-redux'
import { actions as commonActions } from '@store/common/reducer'
import {
  InputArea,
  InputRow,
  TextInput,
  RecordButton,
  SendButton,
  HelpText,
} from '../../../../SessionPractice.styles'
import { FaStop } from 'react-icons/fa'
import Button from '@components/common/Button'

// LocalStorage key for auto-send preference
const AUTO_SEND_STORAGE_KEY = 'osce_auto_send_enabled'

// Helper functions for localStorage
const getAutoSendPreference = () => {
  try {
    const stored = localStorage.getItem(AUTO_SEND_STORAGE_KEY)
    return stored !== null ? JSON.parse(stored) : false // Default to false
  } catch (error) {
    console.error('Error reading auto-send preference:', error)
    return false
  }
}

const setAutoSendPreference = (value) => {
  try {
    localStorage.setItem(AUTO_SEND_STORAGE_KEY, JSON.stringify(value))
  } catch (error) {
    console.error('Error saving auto-send preference:', error)
  }
}

function UserInput({ onSendMessage, onStopStreaming, isSendingMessage, isStreaming }) {
  const dispatch = useDispatch()
  const [inputText, setInputText] = useState('')
  const [interimText, setInterimText] = useState('') // Store interim/partial transcription
  const [autoSendEnabled, setAutoSendEnabled] = useState(() => getAutoSendPreference())

  // Recording hook with Deepgram-first, Whisper fallback
  const handleTranscriptUpdate = useCallback((interimText) => {
    // Show interim results from Deepgram in real-time
    setInterimText(interimText)
  }, [])

  // Handle auto-send after recording completes
  const handleAutoSend = useCallback((finalText) => {
    if (!finalText.trim()) return

    console.log('🚀 Auto-sending message after recording:', finalText)
    onSendMessage(finalText.trim())
  }, [onSendMessage])

  // Handle manual edit mode - add transcript to input for editing
  const handleTranscriptFinal = useCallback((finalText) => {
    setInterimText('') // Clear interim text
    setInputText(prev => prev + finalText)
  }, [])

  const handleRecordingError = useCallback((error) => {
    dispatch(commonActions.setError(error))
  }, [dispatch])

  // Listen for changes to localStorage (when SessionSidebar updates it)
  useEffect(() => {
    const handleStorageChange = () => {
      setAutoSendEnabled(getAutoSendPreference())
    }

    // Listen for storage events from other tabs/components
    window.addEventListener('storage', handleStorageChange)

    // Also poll localStorage periodically to catch same-tab changes
    const interval = setInterval(() => {
      const currentValue = getAutoSendPreference()
      setAutoSendEnabled(prev => {
        if (prev !== currentValue) {
          return currentValue
        }
        return prev
      })
    }, 500)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      clearInterval(interval)
    }
  }, [])

  const recording = useRecording(
    handleTranscriptUpdate,
    handleTranscriptFinal,
    autoSendEnabled, // autoSendEnabled - set to true for immediate send, false for manual edit
    autoSendEnabled ? handleAutoSend : null, // onAutoSend - send immediately if auto-send enabled
    handleRecordingError
  )

  const handleSendMessage = useCallback(() => {
    if (!inputText.trim() || isSendingMessage) return

    const message = inputText.trim()
    setInputText('')
    onSendMessage(message)
  }, [inputText, isSendingMessage, onSendMessage])

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleToggleRecording = useCallback(() => {
    recording.toggleRecording()
  }, [recording])

  // Combine input text with interim text for display
  const displayValue = inputText + (interimText ? interimText : '')

  return (
    <InputArea>
      <InputRow>
        <div style={{ position: 'relative', flex: 1, display: 'flex' }}>
          <TextInput
            placeholder={
              isSendingMessage
                ? "Mengirim pesan..."
                : recording.isRecording
                ? "Sedang merekam... (berbicara sekarang)"
                : recording.isTranscribing
                ? "Memproses audio..."
                : "Ketik pesan Anda di sini..."
            }
            value={displayValue}
            onChange={(e) => {
              // Only allow editing the non-interim part
              const newValue = e.target.value
              if (newValue.length <= inputText.length) {
                setInputText(newValue)
              } else {
                // User is trying to type - only update if not recording
                if (!recording.isRecording && !interimText) {
                  setInputText(newValue)
                }
              }
            }}
            onKeyDown={handleKeyDown}
            disabled={isSendingMessage || recording.isRecording}
            style={{
              fontStyle: interimText ? 'italic' : 'normal',
              flex: 1,
              width: '100%'
            }}
          />
          {interimText && (
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              pointerEvents: 'none',
              padding: '0.625rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              fontSize: '0.9375rem',
              fontFamily: 'inherit',
              lineHeight: '1.4',
              fontStyle: 'normal',
            }}>
              <span style={{ visibility: 'hidden' }}>{inputText}</span>
              <span style={{ fontStyle: 'italic', opacity: 0.7 }}>{interimText}</span>
            </div>
          )}
        </div>

        {/* Priority 1: Stop streaming button when AI is responding */}
        {isStreaming ? (
          <SendButton
            onClick={onStopStreaming}
            style={{ background: '#ef4444' }}
            title="Stop streaming"
          >
            <FaStop />
          </SendButton>
        ) : /* Priority 2: Recording button when actively recording or transcribing */
        recording.isRecording || recording.isTranscribing ? (
          <RecordButton
            recording={recording.isRecording}
            onClick={handleToggleRecording}
            disabled={recording.isTranscribing}
            title={recording.isRecording ? 'Hentikan rekaman' : 'Memproses audio...'}
          >
            {recording.isTranscribing ? '⏳' : '⏹️'}
          </RecordButton>
        ) : /* Priority 3: Send button when there's text to send */
        inputText.trim() ? (
          <SendButton
            onClick={handleSendMessage}
            disabled={isSendingMessage}
            title="Kirim pesan"
          >
            {isSendingMessage ? '⏳' : '➤'}
          </SendButton>
        ) : /* Priority 4: Default record button when idle */
        (
          <RecordButton
            recording={false}
            onClick={handleToggleRecording}
            disabled={false}
            title="Mulai rekam"
          >
            🎤
          </RecordButton>
        )}
      </InputRow>

      <HelpText>
        AI memahami konteks meskipun terdapat typo, pesan aman untuk dikirim
      </HelpText>
    </InputArea>
  )
}

export default memo(UserInput, (prevProps, nextProps) => {
  // Only rerender if sending state or streaming state changes
  return prevProps.isSendingMessage === nextProps.isSendingMessage &&
         prevProps.isStreaming === nextProps.isStreaming
})
