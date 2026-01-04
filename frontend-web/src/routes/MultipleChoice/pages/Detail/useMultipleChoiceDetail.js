import { useState, useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import { fetchMcqTopicById, submitMcqAnswers } from '@store/mcq/action'

export const useMultipleChoiceDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('mode') || 'quiz' // Default to quiz mode

  // Redux state
  const { currentTopic, loading } = useSelector(state => state.mcq)

  // Local state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({}) // { questionId: selectedOptionIndex }
  const [showExplanation, setShowExplanation] = useState(false) // For learning mode
  const [quizResult, setQuizResult] = useState(null)
  const [timer, setTimer] = useState(0) // Timer in seconds
  const [timerActive, setTimerActive] = useState(false)

  // Ref to track if timer has been started (to differentiate initial 0 from countdown reaching 0)
  const timerStartedRef = useRef(false)

  // Load topic on mount and when id changes
  useEffect(() => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowExplanation(false)
    setQuizResult(null)
    setTimer(0)
    setTimerActive(false)
    timerStartedRef.current = false // Reset timer started flag
    dispatch(fetchMcqTopicById(id))
  }, [dispatch, id])

  // Start timer for quiz mode
  useEffect(() => {
    if (currentTopic && mode === 'quiz' && currentTopic.quizTimeLimit > 0 && !quizResult) {
      setTimer(currentTopic.quizTimeLimit * 60) // Convert minutes to seconds
      setTimerActive(true)
    }
  }, [currentTopic, mode, quizResult])

  // Mark timer as started only when it's actually running (timer > 0)
  useEffect(() => {
    if (timer > 0 && timerActive) {
      timerStartedRef.current = true
    }
  }, [timer, timerActive])

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) {
      return
    }

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

  // Handle answer selection
  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))

    if (mode === 'learning') {
      // In learning mode, show explanation immediately
      setShowExplanation(true)
    }
  }

  // Handle next question in learning mode
  const handleNextQuestion = () => {
    const questions = currentTopic?.mcq_questions || []
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setShowExplanation(false)
    } else {
      // End of learning session
      handleLearningComplete()
    }
  }

  // Handle learning complete - submit to backend for progress tracking
  const handleLearningComplete = async () => {
    const questions = currentTopic?.mcq_questions || []
    const formattedAnswers = questions.map(question => ({
      question_id: question.id,
      user_answer: answers[question.id] ?? null
    }))

    const result = await dispatch(submitMcqAnswers(id, formattedAnswers))
    setQuizResult(result)
  }

  // Handle quiz submit
  const handleQuizSubmit = useCallback(async () => {
    setTimerActive(false)

    const questions = currentTopic?.mcq_questions || []
    const formattedAnswers = questions.map(question => ({
      question_id: question.id,
      user_answer: answers[question.id] ?? null
    }))

    const result = await dispatch(submitMcqAnswers(id, formattedAnswers))
    setQuizResult(result)
  }, [currentTopic, answers, id, dispatch])

  // Auto-submit when timer reaches 0 in quiz mode
  useEffect(() => {
    if (timer === 0 && !timerActive && mode === 'quiz' && !quizResult && timerStartedRef.current) {
      // Auto-submit when time runs out (only if timer was actually started)
      handleQuizSubmit()
    }
  }, [timer, timerActive, mode, quizResult, handleQuizSubmit])

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  // Handle navigation between questions in Quiz mode
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleNextQuestionQuiz = () => {
    const questions = currentTopic?.mcq_questions || []
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // Get current question
  const currentQuestion = currentTopic?.mcq_questions?.[currentQuestionIndex]

  // Format timer
  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    // State
    currentTopic,
    currentQuestion,
    currentQuestionIndex,
    quizResult,
    loading,
    answers,
    showExplanation,
    mode,
    timer,
    timerActive,

    // Computed
    formatTimer,
    totalQuestions: currentTopic?.mcq_questions?.length || 0,

    // Handlers
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleNextQuestionQuiz,
    handleQuizSubmit,
    handleBack
  }
}
