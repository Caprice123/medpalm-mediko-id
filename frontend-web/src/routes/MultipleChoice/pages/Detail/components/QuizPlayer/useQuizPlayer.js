import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { submitMcqAnswers } from '@store/mcq/userAction'
import { setInterval, clearInterval } from 'worker-timers'

export const useQuizPlayer = ({ currentTopic, mode, id, onComplete }) => {
  const dispatch = useDispatch()
  const { loading } = useSelector(state => state.mcq)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [timer, setTimer] = useState(0)
  const [timerActive, setTimerActive] = useState(false)
  const timerStartedRef = useRef(false)

  // Reset when topic changes
  useEffect(() => {
    setCurrentQuestionIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setTimer(0)
    setTimerActive(false)
    timerStartedRef.current = false
  }, [currentTopic?.id])

  // Start timer for quiz mode
  useEffect(() => {
    if (currentTopic && mode === 'quiz' && currentTopic.quizTimeLimit > 0) {
      setTimer(currentTopic.quizTimeLimit * 60)
      setTimerActive(true)
    }
  }, [currentTopic, mode])

  // Mark timer as started only when it's actually running
  useEffect(() => {
    if (timer > 0 && timerActive) {
      timerStartedRef.current = true
    }
  }, [timer, timerActive])

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) return

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          setTimerActive(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [timerActive, timer])

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }))
    if (mode === 'learning') setShowExplanation(true)
  }

  const handleLearningComplete = async () => {
    const questions = currentTopic?.mcq_questions || []
    const formattedAnswers = questions.map(question => ({
      question_id: question.id,
      user_answer: answers[question.id] ?? null
    }))
    await dispatch(submitMcqAnswers(id, formattedAnswers, onComplete))
  }

  const handleNextQuestion = () => {
    const questions = currentTopic?.mcq_questions || []
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      handleLearningComplete()
    }
  }

  const handleQuizSubmit = useCallback(async () => {
    setTimerActive(false)
    const questions = currentTopic?.mcq_questions || []
    const formattedAnswers = questions.map(question => ({
      question_id: question.id,
      user_answer: answers[question.id] ?? null
    }))
    await dispatch(submitMcqAnswers(id, formattedAnswers, onComplete))
  }, [currentTopic, answers, id, dispatch, onComplete])

  // Auto-submit when timer reaches 0
  useEffect(() => {
    if (timer === 0 && !timerActive && mode === 'quiz' && timerStartedRef.current) {
      handleQuizSubmit()
    }
  }, [timer, timerActive, mode, handleQuizSubmit])

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) setCurrentQuestionIndex(prev => prev - 1)
  }

  const handleNextQuestionQuiz = () => {
    const questions = currentTopic?.mcq_questions || []
    if (currentQuestionIndex < questions.length - 1) setCurrentQuestionIndex(prev => prev + 1)
  }

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const currentQuestion = currentTopic?.mcq_questions?.[currentQuestionIndex]
  const totalQuestions = currentTopic?.mcq_questions?.length || 0

  return {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    showExplanation,
    timer,
    timerActive,
    loading,
    formatTimer,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleNextQuestionQuiz,
    handleQuizSubmit
  }
}
