import { useMemo, useState } from 'react'

const CLOZE_TOKEN_REGEX = /\{\{(\d+)\}\}/g

function parseClozeParts(text) {
  const parts = []
  let lastIndex = 0
  let match
  CLOZE_TOKEN_REGEX.lastIndex = 0
  while ((match = CLOZE_TOKEN_REGEX.exec(text || '')) !== null) {
    if (match.index > lastIndex) parts.push({ type: 'text', value: text.slice(lastIndex, match.index) })
    parts.push({ type: 'blank', number: parseInt(match[1]) })
    lastIndex = CLOZE_TOKEN_REGEX.lastIndex
  }
  if (lastIndex < (text || '').length) parts.push({ type: 'text', value: text.slice(lastIndex) })
  return parts
}

export function useClozeCard({ text, onFullyRevealed }) {
  const parts = useMemo(() => parseClozeParts(text), [text])
  const [revealed, setRevealed] = useState(false)
  const [userAnswers, setUserAnswers] = useState({})

  const setUserAnswer = (blankNumber, value) => setUserAnswers(prev => ({ ...prev, [blankNumber]: value }))

  const reveal = () => {
    if (revealed) return
    setRevealed(true)
    onFullyRevealed?.()
  }

  return { parts, revealed, userAnswers, setUserAnswer, reveal }
}
