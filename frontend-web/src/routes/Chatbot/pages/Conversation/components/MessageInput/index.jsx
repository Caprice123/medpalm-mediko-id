import { memo, useCallback, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import {
  Container,
  InputWrapper,
  Textarea,
  SendButton,
  CostIndicator
} from './MessageInput.styles'

function MessageInput({ onSend, disabled, currentMode }) {
  const { costs } = useSelector(state => state.chatbot)
  const [value, setValue] = useState('')

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !disabled) {
        onSend(value.trim())
        setValue('')
      }
    }
  }, [onSend, value, disabled])

  const handleChange = useCallback((e) => {
    setValue(e.target.value)
  }, [])

  const handleSendClick = useCallback(() => {
    if (value.trim() && !disabled) {
      onSend(value.trim())
      setValue('')
    }
  }, [onSend, value, disabled])

  const cost = useMemo(() => {
    // Read from Redux state (fetched from backend config)
    if (costs && costs[currentMode] != null) {
      return costs[currentMode]
    }

    // Fallback to default values if config not loaded
    switch (currentMode) {
      case 'normal': return 5
      case 'validated': return 8
      case 'research': return 15
      default: return 0
    }
  }, [costs, currentMode])

  return (
    <Container>
      <InputWrapper>
        <Textarea
          value={value}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Ketik pesan Anda... (Tekan Enter untuk kirim, Shift+Enter untuk baris baru)"
          disabled={disabled}
          rows={1}
        />
        <SendButton
          onClick={handleSendClick}
          disabled={disabled || !value.trim()}
        >
          {disabled ? '⏳' : '📤'}
        </SendButton>
      </InputWrapper>
      { cost != null && cost > 0 && (
        <CostIndicator>
            Biaya: {cost} kredit per pesan
        </CostIndicator>
      )}
    </Container>
  )
}

export default memo(MessageInput)
