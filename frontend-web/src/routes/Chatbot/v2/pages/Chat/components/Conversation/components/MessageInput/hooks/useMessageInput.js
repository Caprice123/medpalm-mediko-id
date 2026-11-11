import { useState } from 'react'
import { useSelector } from 'react-redux'

// Shown when the backend config has not loaded yet, so the composer never
// claims a message is free when it is not.
const FALLBACK_COSTS = { normal: 5, validated: 8, research: 15 }

export const useMessageInput = ({ onSend, currentMode, isStreaming }) => {
  const [value, setValue] = useState('')
  const cost = useSelector(state => state.chatbotV2.costs?.[currentMode]) ?? FALLBACK_COSTS[currentMode] ?? 0

  // The composer is blocked while an answer is still arriving — one question at
  // a time per thread.
  const canSend = Boolean(value.trim()) && !isStreaming

  const submit = () => {
    if (!canSend) return

    onSend(value.trim())
    setValue('')
  }

  const handleChange = (event) => setValue(event.target.value)

  // Enter sends, Shift+Enter breaks the line — keyDown rather than the
  // deprecated keyPress, which never fires for some keyboard layouts.
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return

    event.preventDefault()
    submit()
  }

  return {
    value,
    cost,
    canSend,
    handleChange,
    handleKeyDown,
    submit,
  }
}
