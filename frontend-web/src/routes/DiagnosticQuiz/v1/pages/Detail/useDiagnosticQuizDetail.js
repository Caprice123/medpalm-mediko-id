import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchDetailDiagnosticQuiz, submitDiagnosticQuizAnswers } from '@store/diagnostic/userAction'
import { fetchConstants } from '@store/constant/action'
import { actions } from '../../../../../store/constant/reducer'

export const useDiagnosticQuizDetail = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { id } = useParams()

  const { detail: currentQuiz, loading } = useSelector(state => state.diagnostic)

  const [answers, setAnswers] = useState({})
  const [formErrors, setFormErrors] = useState({})
  const [quizResult, setQuizResult] = useState(null)
  const [sectionTitle, setSectionTitle] = useState('Identifikasi Bagian Anatomi')

  useEffect(() => {
    const fetchCorrespondingConstant = async () => {
      try {
        const keys = ['diagnostic_section_title']
        dispatch(actions.updateFilter({ key: 'keys', value: keys }))
        const constants = await dispatch(fetchConstants())
        if (constants?.diagnostic_section_title) {
          setSectionTitle(constants.diagnostic_section_title)
        }
      } catch (error) {
        console.error('Failed to fetch constants:', error)
      }
    }
    fetchCorrespondingConstant()
  }, [dispatch])

  useEffect(() => {
    setAnswers({})
    setFormErrors({})
    setQuizResult(null)
    dispatch(fetchDetailDiagnosticQuiz(id))
  }, [dispatch, id])

  const handleInputChange = (questionId, value) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
    if (formErrors[questionId]) {
      setFormErrors(prev => ({ ...prev, [questionId]: '' }))
    }
  }

  const validateInputs = () => {
    const errors = {}
    if (!currentQuiz?.diagnostic_questions) return false
    currentQuiz.diagnostic_questions.forEach(question => {
      const value = answers[question.id]
      if (!value || value.trim() === '') {
        errors[question.id] = `Jawaban untuk pertanyaan ini wajib diisi`
      }
    })
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateInputs()) return
    const formattedAnswers = Object.keys(answers).map(questionId => ({
      question_id: parseInt(questionId),
      answer: answers[questionId]
    }))
    await dispatch(submitDiagnosticQuizAnswers(id, formattedAnswers, (result) => {
      setQuizResult(result)
    }))
  }

  const handleBack = () => { navigate(-1) }

  return {
    currentQuiz,
    quizResult,
    loading,
    answers,
    formErrors,
    sectionTitle,
    handleInputChange,
    handleSubmit,
    handleBack
  }
}
