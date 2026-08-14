import { useState, useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { submitFlashcardRating } from '@store/flashcardNodes/userAction'

const MAX_LAGI = 2

export function useAnkiPlayer({ deck, onBack }) {
  const dispatch = useDispatch()
  const cards = deck.cards || []

  const [queue, setQueue] = useState(() => [...cards])
  const [retryCounts, setRetryCounts] = useState({})
  const [index, setIndex] = useState(0)
  const [revealed, setRevealed] = useState(false)

  const card = queue[index]
  const progress = (index / queue.length) * 100
  const retryCount = card ? (retryCounts[card.id] || 0) : 0

  const handleReveal = useCallback(() => {
    if (!revealed) setRevealed(true)
  }, [revealed])

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && card?.type !== 'cloze' && card?.type !== 'occlusion') {
        e.preventDefault(); handleReveal()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleReveal, card])

  const handleRate = (ratingKey) => {
    dispatch(submitFlashcardRating(card.id, ratingKey))

    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_LAGI) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }

    const nextIndex = index + 1
    if (nextIndex >= newQueue.length) {
      onBack()
    } else {
      setIndex(nextIndex)
      setRevealed(false)
    }
  }

  return {
    queue, card, index, progress, retryCount,
    revealed, handleReveal,
    handleRate,
  }
}
