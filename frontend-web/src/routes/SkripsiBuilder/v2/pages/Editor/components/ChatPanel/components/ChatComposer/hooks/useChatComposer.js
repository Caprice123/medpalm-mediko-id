import { useState } from 'react'

export const useChatComposer = ({ onSend, isStreaming }) => {
  const [value, setValue] = useState('')

  // The composer is blocked while an answer is still arriving — one question
  // at a time per tab.
  const canSend = Boolean(value.trim()) && !isStreaming

  const submit = () => {
    if (!canSend) return

    onSend(value.trim())
    setValue('')
  }

  // Enter sends, Shift+Enter breaks the line.
  const handleKeyDown = (event) => {
    if (event.key !== 'Enter' || event.shiftKey) return

    event.preventDefault()
    submit()
  }

  return {
    value,
    canSend,
    handleChange: (event) => setValue(event.target.value),
    handleKeyDown,
    submit,
  }
}
