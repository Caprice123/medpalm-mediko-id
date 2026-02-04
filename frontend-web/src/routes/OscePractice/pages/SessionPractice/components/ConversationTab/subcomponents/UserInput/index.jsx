import { useState, memo, useCallback, useEffect, useRef } from 'react'
import { useRecording } from '@hooks/useRecording'
import { useDispatch, useSelector } from 'react-redux'
import { actions as commonActions } from '@store/common/reducer'
import { updateSessionMetadata } from '@store/oscePractice/userAction'
import { useParams } from 'react-router-dom'
import { getAvailableSttProvider } from '@utils/testDeepgramConnection'
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

function UserInput({ onSendMessage, disabled, sttProvider: initialSttProvider }) {
  const dispatch = useDispatch()
  const { sessionId } = useParams()
  const inputRef = useRef(null)
  const [inputText, setInputText] = useState('')
  const [interimText, setInterimText] = useState('') // Store interim/partial transcription
  const [autoSendEnabled, setAutoSendEnabled] = useState(() => getAutoSendPreference())
  const [sttProvider, setSttProvider] = useState(initialSttProvider)

  // Update sttProvider when initialSttProvider changes
  useEffect(() => {
    if (initialSttProvider) {
      setSttProvider(initialSttProvider)
    }
  }, [initialSttProvider])

  // Handle provider change (e.g., fallback from Deepgram to Whisper)
  const handleProviderChange = useCallback((newProvider) => {
    setSttProvider(newProvider)
    if (sessionId) {
      dispatch(updateSessionMetadata(sessionId, { sttProvider: newProvider }))
    }
  }, [sessionId, dispatch])

  // Recording hook with Deepgram-first, Whisper fallback
  const handleTranscriptUpdate = useCallback((interimText) => {
    // Show interim results from Deepgram in real-time
    setInterimText(interimText)
  }, [])

  // Handle manual edit mode - set transcript as input value (replace, not append)
  const handleTranscriptFinal = useCallback((finalText) => {
    setInterimText('') // Clear interim text
    setInputText(finalText)
  }, [])

  const handleRecordingError = useCallback((error) => {
    dispatch(commonActions.setError(error))
  }, [dispatch])

  // Auto-focus input when assistant finishes typing
  useEffect(() => {
    // When disabled changes from true to false, auto-focus the input
    if (!disabled && inputRef.current) {
      inputRef.current.focus()
    }
  }, [disabled])

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


  const handleSendMessage = useCallback((textToSend) => {
    // If textToSend is provided (from auto-send), use it; otherwise use inputText
    const message = textToSend || inputText.trim()

    if (!message || disabled) return

    setInputText('')
    onSendMessage(message)
  }, [inputText, disabled, onSendMessage])


  const recording = useRecording(
    handleTranscriptUpdate,
    handleTranscriptFinal,
    autoSendEnabled, // autoSendEnabled - set to true for immediate send, false for manual edit
    autoSendEnabled ? handleSendMessage : null, // onAutoSend - send immediately if auto-send enabled
    handleRecordingError,
    sttProvider || 'whisper', // Pass the determined STT provider (default whisper while testing)
    handleProviderChange // Handle provider change (fallback)
  )


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
    if (recording.isTranscribing) {
      return "Mengirim ke Whisper..."
    }
    const isActive = recording.isRecording
    return isActive ? "Merekam..." : "Mulai Rekam"
  }

  return (
    <InputArea>
      <InputWrapper>
        <TextInput
          ref={inputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled || recording.isRecording || recording.isTranscribing}
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
          recording={recording.isRecording || recording.isTranscribing}
          disabled={recording.isTranscribing || disabled}
          title={
            recording.isTranscribing ? 'Mengirim ke Whisper...' :
            recording.isRecording ? 'Hentikan rekaman' :
            'Mulai rekam'
          }
        >
          {recording.isRecording ? <FaMicrophone size={18} /> : <FaMicrophoneSlash size={18} />}
          {determineRecordingText()}
        </RecordButton>

        <SendButton
          onClick={handleSendMessage}
          disabled={!inputText.trim() || recording.isRecording || recording.isTranscribing || disabled}
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
  // Only rerender if disabled state changes
  return prevProps.disabled === nextProps.disabled
})
