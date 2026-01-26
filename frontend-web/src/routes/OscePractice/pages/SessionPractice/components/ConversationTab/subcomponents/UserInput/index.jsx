import { useState, memo, useCallback, useEffect } from 'react'
import { useRecording } from '@hooks/useRecording'
import { useDispatch } from 'react-redux'
import { actions as commonActions } from '@store/common/reducer'
import {
  InputArea,
  InputWrapper,
  InputRow,
  TextInput,
  InterimOverlay,
  RecordButton,
  SendButton,
  HelpText,
  InputActions,
} from '../../../../SessionPractice.styles'
import { FaMicrophone, FaMicrophoneSlash, FaPaperPlane } from 'react-icons/fa'

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

function UserInput({ onSendMessage, isSendingMessage, isStreaming }) {
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

  const determineRecordingText = () => {
    const isActive = recording.isRecording
    return isActive ? "Merekam..." : "Mulai Rekam"
  }

  return (
    <InputArea>
      <InputWrapper>
        <TextInput
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSendingMessage || isStreaming || recording.isRecording || recording.isTranscribing}
        />
        {interimText && (
          <InterimOverlay>
            <span style={{ visibility: 'hidden' }}>{inputText}</span>
            <span style={{ fontStyle: 'italic', opacity: 0.7, color: '#666' }}>{interimText}</span>
          </InterimOverlay>
        )}
      </InputWrapper>

      <InputActions>
        <RecordButton
          onClick={handleToggleRecording}
          recording={recording.isRecording}
          disabled={recording.isTranscribing || isSendingMessage || isStreaming}
          title={recording.isRecording ? 'Hentikan rekaman' : 'Mulai rekam'}
        >
          {recording.isRecording ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
          {determineRecordingText()}
        </RecordButton>

        <SendButton
          onClick={handleSendMessage}
          disabled={!inputText.trim() || recording.isRecording || recording.isTranscribing || isSendingMessage || isStreaming}
          title="Kirim pesan"
        >
          <FaPaperPlane />
        </SendButton>
      </InputActions>

      {autoSendEnabled && (
        <HelpText style={{ marginTop: '12px' }}>
          Mode auto-send aktif - rekaman akan otomatis terkirim setelah selesai
        </HelpText>
      )}

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
