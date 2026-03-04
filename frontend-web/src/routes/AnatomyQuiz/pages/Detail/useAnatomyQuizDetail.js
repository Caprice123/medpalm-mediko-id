import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchDetailAnatomyQuiz, submitAnatomyQuizAnswers } from '@store/anatomy/userAction'
import { fetchConstants } from '@store/constant/action'
import { actions } from '../../../../store/constant/reducer'

export const useAnatomyQuizDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  // Redux state
  const { detail: currentQuiz, loading } = useSelector(state => state.anatomy)

  // Local state
  const [answers, setAnswers] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [sectionTitle, setSectionTitle] = useState('Identifikasi Bagian Anatomi')

  // Fetch constants on mount
  useEffect(() => {
    const fetchCorrespondingConstant = async () => {
      try {
        const keys = ['anatomy_section_title']
        dispatch(actions.updateFilter({ key: 'keys', value: keys }))
        const constants = await dispatch(fetchConstants())
        if (constants?.anatomy_section_title) {
          setSectionTitle(constants.anatomy_section_title)
        }
      } catch (error) {
        console.error('Failed to fetch constants:', error)
      }
    }
    fetchCorrespondingConstant()
  }, [dispatch])

  // Load quiz on mount and when id changes
  useEffect(() => {
    setAnswers({})
    setFormErrors({})
    setQuizResult(null)
    dispatch(fetchDetailAnatomyQuiz(id))
  }, [dispatch, id])

  // Handle input change
  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))

    // Clear error for this field when user starts typing
    if (formErrors[questionId]) {
      setFormErrors(prev => ({
        ...prev,
        [questionId]: ''
      }))
    }
  }

  // Validate inputs
  const validateInputs = () => {
    const errors = {}

    if (!currentQuiz?.anatomy_questions) return false

    currentQuiz.anatomy_questions.forEach(question => {
      const value = answers[question.id]

      if (!value || value.trim() === '') {
        errors[question.id] = `Jawaban untuk pertanyaan ini wajib diisi`
      }
    })

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateInputs()) {
      return
    }

    // Format answers for submission
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      question_id: parseInt(questionId),
      answer: answers[questionId]
    }))

      await dispatch(submitAnatomyQuizAnswers(id, formattedAnswers, (result) => {
          setQuizResult(result)
      }))
  }

  // Handle back navigation
  const handleBack = () => {
    navigate(-1)
  }

  return {
    // State
    currentQuiz,
    quizResult,
    loading,
    answers,
    formErrors,
    sectionTitle,

    // Handlers
    handleInputChange,
    handleSubmit,
    handleBack
  }
}
