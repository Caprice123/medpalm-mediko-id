import { useState, useEffect } from 'react'
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

  // Load topic on mount and when id changes
  useEffect(() => {
    setAnswers({})
    setCurrentQuestionIndex(0)
    setShowExplanation(false)
    setQuizResult(null)
    setTimer(0)
    setTimerActive(false)
    dispatch(fetchMcqTopicById(id))
  }, [dispatch, id])

  // Start timer for quiz mode
  useEffect(() => {
    if (currentTopic && mode === 'quiz' && currentTopic.quiz_time_limit > 0 && !quizResult) {
      setTimer(currentTopic.quiz_time_limit * 60) // Convert minutes to seconds
      setTimerActive(true)
    }
  }, [currentTopic, mode, quizResult])

  // Timer countdown
  useEffect(() => {
    if (!timerActive || timer <= 0) {
      if (timer === 0 && timerActive && mode === 'quiz') {
        // Auto-submit when time runs out
        handleQuizSubmit()
      }
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

  // Handle learning complete
  const handleLearningComplete = () => {
    const questions = currentTopic?.mcq_questions || []
    let correctCount = 0

    questions.forEach(question => {
      if (answers[question.id] === question.correct_answer) {
        correctCount++
      }
    })

    const score = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

    setQuizResult({
      score,
      correct_questions: correctCount,
      total_questions: questions.length,
      passed: score >= (currentTopic?.passing_score || 0),
      answers: questions.map(q => ({
        question_id: q.id,
        question: q.question,
        user_answer: answers[q.id] ?? null,
        correct_answer: q.correct_answer,
        is_correct: answers[q.id] === q.correct_answer,
        explanation: q.explanation,
        options: q.options
      }))
    })
  }

  // Handle quiz submit
  const handleQuizSubmit = async () => {
    setTimerActive(false)

    const questions = currentTopic?.mcq_questions || []
    const formattedAnswers = questions.map(question => ({
      question_id: question.id,
      user_answer: answers[question.id] ?? null
    }))

    try {
      const result = await dispatch(submitMcqAnswers(id, formattedAnswers))
      setQuizResult(result)
    } catch (error) {
      console.error('Failed to submit quiz:', error)
    }
  }

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
