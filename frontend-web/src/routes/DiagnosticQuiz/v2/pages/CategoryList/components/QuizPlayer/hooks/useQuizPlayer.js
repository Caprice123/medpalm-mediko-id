import { useState, useCallback, useEffect, useMemo, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { submitDiagnosticRating } from '@store/diagnosticNodes/userAction'

export const RATINGS = [
  { key: 'again', label: 'Lagi',  color: 'var(--color-danger)' },
  { key: 'hard',  label: 'Sulit', color: 'var(--color-warning-text)' },
  { key: 'good',  label: 'Baik',  color: 'var(--color-brand-blue)' },
  { key: 'easy',  label: 'Mudah', color: 'var(--color-brand-green)' },
]

export const MAX_AGAIN = 2

// Percent of the body width the case panel may occupy while dragging the divider.
const MIN_CASE_WIDTH_PERCENT = 25
const MAX_CASE_WIDTH_PERCENT = 75
const DEFAULT_CASE_WIDTH_PERCENT = 50

export function useQuizPlayer({ cards, onBack }) {
  const dispatch = useDispatch()

  const [queue, setQueue] = useState(() => [...cards])
  const [index, setIndex] = useState(0)
  // Per-question state within the current case: { [questionId]: { selected, revealed, textAnswer } }
  const [answers, setAnswers] = useState({})
  const [retryCounts, setRetryCounts] = useState({})
  const [photoOpen, setPhotoOpen] = useState(false)
  // Adjustable case/question split (desktop only) — percent width of the case panel.
  const [caseWidthPercent, setCaseWidthPercent] = useState(DEFAULT_CASE_WIDTH_PERCENT)

  const bodyRef = useRef(null)
  const casePanelRef = useRef(null)
  const questionPanelRef = useRef(null)
  const isResizingRef = useRef(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const card = queue[index]
  const questions = useMemo(() => card?.questions || [], [card])

  // Each panel scrolls on its own from 1025px up, and the body is the single scroll
  // container below that — so a new case has to reset all three, and clear its answers.
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: 0 })
    casePanelRef.current?.scrollTo({ top: 0 })
    questionPanelRef.current?.scrollTo({ top: 0 })
    setAnswers({})
  }, [index])

  useEffect(() => {
    const handleMove = (e) => {
      if (!isResizingRef.current || !bodyRef.current) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const rect = bodyRef.current.getBoundingClientRect()
      const percent = ((clientX - rect.left) / rect.width) * 100
      setCaseWidthPercent(Math.min(MAX_CASE_WIDTH_PERCENT, Math.max(MIN_CASE_WIDTH_PERCENT, percent)))
    }
    const stopResizing = () => {
      if (!isResizingRef.current) return
      isResizingRef.current = false
      document.body.style.cursor = ''
      document.body.style.userSelect = ''
    }

    window.addEventListener('mousemove', handleMove)
    window.addEventListener('mouseup', stopResizing)
    window.addEventListener('touchmove', handleMove)
    window.addEventListener('touchend', stopResizing)
    return () => {
      window.removeEventListener('mousemove', handleMove)
      window.removeEventListener('mouseup', stopResizing)
      window.removeEventListener('touchmove', handleMove)
      window.removeEventListener('touchend', stopResizing)
    }
  }, [])

  const startResizing = useCallback((e) => {
    e.preventDefault()
    isResizingRef.current = true
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'
  }, [])

  const progress = queue.length > 0 ? (index / queue.length) * 100 : 0
  const retryCount = card ? (retryCounts[card.id] || 0) : 0
  const hasCaseContent = !!(card?.imageUrl || card?.vignette)
  // One rating covers the whole case, so it only unlocks once every question is open
  const allRevealed = questions.length > 0 && questions.every(q => answers[q.id]?.revealed)

  const handleSelectChoice = useCallback((questionId, choice) => {
    setAnswers(prev => {
      if (prev[questionId]?.revealed) return prev
      return { ...prev, [questionId]: { ...prev[questionId], selected: choice, revealed: true } }
    })
  }, [])

  const handleReveal = useCallback((questionId) => {
    setAnswers(prev => {
      if (prev[questionId]?.revealed) return prev
      return { ...prev, [questionId]: { ...prev[questionId], revealed: true } }
    })
  }, [])

  const handleTextAnswerChange = useCallback((questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: { ...prev[questionId], textAnswer: value } }))
  }, [])

  const handleRevealAll = useCallback(() => {
    setAnswers(prev => {
      const next = { ...prev }
      questions.forEach(q => { next[q.id] = { ...next[q.id], revealed: true } })
      return next
    })
  }, [questions])

  const getChoiceState = (questionId, choice, correctAnswer) => {
    const entry = answers[questionId]
    if (!entry?.revealed) return entry?.selected === choice ? 'selected' : 'idle'
    if (choice === correctAnswer) return 'correct'
    if (choice === entry.selected && choice !== correctAnswer) return 'wrong'
    return 'reveal'
  }

  const handleRate = async (ratingKey) => {
    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_AGAIN) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }

    const nextIndex = index + 1
    if (nextIndex >= newQueue.length) {
      await dispatch(submitDiagnosticRating(card.id, ratingKey))
      onBack()
    } else {
      dispatch(submitDiagnosticRating(card.id, ratingKey))
      setIndex(nextIndex)
    }
  }

  return {
    card, questions, queue, index, progress, retryCount,
    hasCaseContent, answers, allRevealed,
    photoOpen, setPhotoOpen,
    bodyRef, casePanelRef, questionPanelRef,
    caseWidthPercent, startResizing,
    handleSelectChoice, handleReveal, handleTextAnswerChange, handleRevealAll,
    getChoiceState, handleRate,
  }
}
