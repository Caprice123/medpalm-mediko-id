import { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startFlashcardNodeSession, submitFlashcardRating } from '@store/flashcardNodes/userAction'

export const MAX_LAGI = 2

export function useFlashcardTab(subtopic, flashcardMax) {
  const dispatch = useDispatch()
  const { sessionCards, loading } = useSelector(s => s.flashcardNodes)

  const [count, setCount] = useState(20)
  const [playing, setPlaying] = useState(false)
  const [queue, setQueue] = useState([])
  const [cardIndex, setCardIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [retryCounts, setRetryCounts] = useState({})
  const [done, setDone] = useState(false)

  // seed the queue from Redux once the session starts
  useEffect(() => {
    if (!playing) return
    setQueue([...sessionCards])
    setCardIndex(0); setRevealed(false); setRetryCounts({}); setDone(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const handleReveal = useCallback(() => setRevealed(true), [])

  const handleStart = () => {
    const n = Math.min(Math.max(1, count), flashcardMax)
    dispatch(startFlashcardNodeSession(subtopic.id, n, () => setPlaying(true)))
  }

  const handleRate = (ratingKey) => {
    const card = queue[cardIndex]
    dispatch(submitFlashcardRating(card.id, ratingKey))
    const retryCount = retryCounts[card.id] || 0
    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_LAGI) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }
    const next = cardIndex + 1
    if (next >= newQueue.length) setDone(true)
    else { setCardIndex(next); setRevealed(false) }
  }

  const handleExit = () => { setPlaying(false); setDone(false) }

  const card = queue[cardIndex]
  const retryCount = card ? (retryCounts[card.id] || 0) : 0

  return {
    count, setCount,
    playing, queue, cardIndex, revealed, done, card, retryCount,
    isStarting: loading.isStartingSession,
    handleStart, handleRate, handleReveal, handleExit,
  }
}
