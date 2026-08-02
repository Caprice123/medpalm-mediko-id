import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { startMcqNodeSession, submitMcqAnswer, submitMcqSession } from '@store/mcqNodes'

export function useMcqTab(subtopic, mcqMax) {
  const dispatch = useDispatch()
  const { sessionQuestions, loading } = useSelector(s => s.mcqNodes)

  const [count, setCount] = useState(20)
  const [playing, setPlaying] = useState(false)
  const [questions, setQuestions] = useState([])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answers, setAnswers] = useState([])
  const [finished, setFinished] = useState(false)

  // seed questions from Redux once the session starts
  useEffect(() => {
    if (!playing) return
    setQuestions([...sessionQuestions])
    setIndex(0); setSelected(null); setAnswers([]); setFinished(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing])

  const handleStart = () => {
    const n = Math.min(Math.max(1, count), mcqMax)
    dispatch(startMcqNodeSession(subtopic.id, n)).then(() => setPlaying(true))
  }

  const handleSelect = (optIdx) => {
    if (selected !== null) return
    const q = questions[index]
    const isCorrect = optIdx === q.correctIndex
    setSelected(optIdx)
    setAnswers(prev => [...prev, { questionId: q.id, nodeId: q.nodeId, selectedIndex: optIdx, isCorrect }])
    dispatch(submitMcqAnswer(q.id, isCorrect))
  }

  const handleNext = () => {
    if (index === questions.length - 1) setFinished(true)
    else { setIndex(i => i + 1); setSelected(null) }
  }

  const handleExit = () => setPlaying(false)

  const handleSubmit = () => {
    const nodeMap = new Map()
    for (const a of answers) {
      const key = a.nodeId ?? 0
      if (!nodeMap.has(key)) nodeMap.set(key, { nodeId: key, correct: 0, total: 0 })
      const entry = nodeMap.get(key)
      entry.total++
      if (a.isCorrect) entry.correct++
    }
    const nodeResults = [...nodeMap.values()].filter(r => r.nodeId).map(r => ({ nodeId: r.nodeId, correct: r.correct, total: r.total }))
    if (nodeResults.length > 0) dispatch(submitMcqSession(nodeResults, handleExit))
    else handleExit()
  }

  const question = questions[index]
  const isAnswered = selected !== null
  const isLast = index === questions.length - 1
  const totalCorrect = answers.filter(a => a.isCorrect).length

  return {
    count, setCount,
    playing, questions, index, selected, answers, finished,
    question, isAnswered, isLast, totalCorrect,
    isStarting: loading.isStartingSession,
    isSubmitting: loading.isSubmittingSession,
    handleStart, handleSelect, handleNext, handleSubmit, handleExit,
  }
}
