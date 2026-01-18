import { useState, memo, useCallback } from 'react'
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

function UserInput({ onSendMessage, onStopStreaming, isSendingMessage, isStreaming }) {
  const dispatch = useDispatch()
  const [inputText, setInputText] = useState('')

  // Recording hook with Deepgram-first, Whisper fallback
  const handleTranscriptUpdate = useCallback((interimText) => {
    // For interim results from Deepgram, we could show them in a different way
    // For now, we'll just let the final transcript update the input
  }, [])

  const handleTranscriptFinal = useCallback((finalText) => {
    setInputText(prev => prev + finalText)
  }, [])

  const handleRecordingError = useCallback((error) => {
    dispatch(commonActions.setError(error))
  }, [dispatch])

  const recording = useRecording(
    handleTranscriptUpdate,
    handleTranscriptFinal,
    false, // autoSendEnabled - set to false for manual send
    null, // onAutoSend
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

  return (
    <InputArea>
      <InputRow>
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
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isSendingMessage || recording.isRecording}
        />

        {isStreaming ? (
          <SendButton
            onClick={onStopStreaming}
            style={{ background: '#ef4444' }}
            title="Stop streaming"
          >
            <FaStop />
          </SendButton>
        ) : inputText.trim() ? (
          <SendButton
            onClick={handleSendMessage}
            disabled={isSendingMessage}
            title="Kirim pesan"
          >
            {isSendingMessage ? '⏳' : '➤'}
          </SendButton>
        ) : (
          <RecordButton
            recording={recording.isRecording}
            onClick={handleToggleRecording}
            disabled={recording.isTranscribing}
            title={recording.isRecording ? 'Hentikan rekaman' : 'Mulai rekam'}
          >
            {recording.isTranscribing ? '⏳' : recording.isRecording ? '⏹️' : '🎤'}
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
