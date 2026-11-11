import { memo } from 'react'
import { useMessageInput } from './hooks/useMessageInput'
import {
  Container,
  InputWrapper,
  Textarea,
  SendButton,
  CostIndicator,
} from './MessageInput.styles'

const MessageInput = ({ onSend, onStop, currentMode, isStreaming }) => {
  const { value, cost, canSend, handleChange, handleKeyDown, submit } = useMessageInput({
    onSend,
    currentMode,
    isStreaming,
  })

  return (
    <Container>
      <InputWrapper>
        <Textarea
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Ketik pesan Anda... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={isStreaming}
          rows={1}
        />

        {isStreaming ? (
          <SendButton onClick={onStop} title="Hentikan jawaban" $variant="stop">
            ⏹️
          </SendButton>
        ) : (
          <SendButton onClick={submit} disabled={!canSend} title="Kirim pesan">
            📤
          </SendButton>
        )}
      </InputWrapper>

      {cost > 0 && (
        <CostIndicator>Biaya: {cost} kredit per pesan</CostIndicator>
      )}
    </Container>
  )
}

export default memo(MessageInput)
