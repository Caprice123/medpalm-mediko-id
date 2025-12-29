import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchDetailAnatomyQuiz,
  submitAnatomyQuizAnswers,
} from '@store/anatomy/action'
import QuizResult from './QuizResult'
import {
  Container,
  QuizContainer,
  ImageSection,
  ImageContainer,
  QuizImage,
  ImageHint,
  QuestionsSection,
  QuizHeader,
  QuizTitle,
  QuizDescription,
  QuestionsList,
  QuestionCard,
  QuestionNumber,
  QuestionLabel,
  AnswerInput,
  ErrorText,
  SubmitSection,
  SubmitButton,
  BackButton,
  LoadingOverlay,
  ErrorMessage,
  SubscriptionGate,
  GateIcon,
  GateTitle,
  GateText,
  GateButton
} from './QuizDetail.styles'

function QuizDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { detail: currentQuiz, loading } = useSelector(state => state.anatomy)

  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [imageZoomed, setImageZoomed] = useState(false)
  const [showSubscriptionGate, setShowSubscriptionGate] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [quizResult, setQuizResult] = useState(null)

  useEffect(() => {
    dispatch(fetchDetailAnatomyQuiz(id))
  }, [id, dispatch])

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: value
    }))
    // Clear error for this question
    if (errors[questionId]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[questionId]
        return newErrors
      })
    }
  }

  const validateAnswers = () => {
    const newErrors = {}
    currentQuiz.questions.forEach(question => {
      const answer = answers[question.id]?.trim()
      if (!answer) {
        newErrors[question.id] = 'This field is required'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateAnswers()) {
      return
    }

    try {
      const formattedAnswers = Object.entries(answers).map(([questionId, userAnswer]) => ({
        questionId: parseInt(questionId),
        userAnswer: userAnswer.trim()
      }))

      const result = await dispatch(submitAnatomyQuizAnswers(id, formattedAnswers))
      setQuizResult(result)
    } catch (error) {
      console.error('Failed to submit answers:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to submit answers')
    }
  }

  const handleBack = () => {
    navigate('/anatomy')
  }

  const handleSubscribe = () => {
    navigate('/dashboard')
  }

  // Show subscription gate
  if (showSubscriptionGate) {
    return (
      <Container>
        <SubscriptionGate>
          <GateIcon>🔒</GateIcon>
          <GateTitle>Subscription Required</GateTitle>
          <GateText>
            Anatomy Quizzes are available exclusively for subscribers.
            Subscribe now to unlock access to all quizzes!
          </GateText>
          <GateButton onClick={handleSubscribe}>
            View Subscription Plans
          </GateButton>
        </SubscriptionGate>
      </Container>
    )
  }

  // Show error message
  if (errorMessage) {
    return (
      <Container>
        <ErrorMessage>
          <h3 style={{ marginBottom: '1rem' }}>Error</h3>
          <p>{errorMessage}</p>
          <button
            onClick={handleBack}
            style={{
              marginTop: '1.5rem',
              padding: '0.75rem 1.5rem',
              background: '#991b1b',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Back to Quizzes
          </button>
        </ErrorMessage>
      </Container>
    )
  }

  // Show result if quiz has been submitted
  if (quizResult) {
    return <QuizResult result={quizResult} onBack={handleBack} />
  }

  // Loading state
  if (loading.isGetDetailAnatomyQuizLoading || !currentQuiz) {
    return (
      <Container>
        <LoadingOverlay>Loading quiz...</LoadingOverlay>
      </Container>
    )
  }

  return (
    <Container>
      <QuizContainer>
        <ImageSection>
          <ImageContainer>
            <QuizImage
              src={currentQuiz.imageUrl}
              alt={currentQuiz.title}
              zoomed={imageZoomed}
              onClick={() => setImageZoomed(!imageZoomed)}
            />
          </ImageContainer>
          <ImageHint>
            {imageZoomed ? 'Click to zoom out' : 'Click to zoom in'}
          </ImageHint>
        </ImageSection>

        <QuestionsSection>
          <QuizHeader>
            <QuizTitle>{currentQuiz.title}</QuizTitle>
            {currentQuiz.description && (
              <QuizDescription>{currentQuiz.description}</QuizDescription>
            )}
            <div style={{ color: '#6BB9E8', fontWeight: 600 }}>
              {currentQuiz.questions?.length || 0} Questions
            </div>
          </QuizHeader>

          <QuestionsList>
            {currentQuiz.questions?.map((question, index) => (
              <QuestionCard key={question.id} hasError={errors[question.id]}>
                <QuestionNumber>Question {index + 1}</QuestionNumber>
                <QuestionLabel>{question.question}</QuestionLabel>
                <AnswerInput
                  type="text"
                  value={answers[question.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                  placeholder="Type your answer here..."
                />
                {errors[question.id] && (
                  <ErrorText>{errors[question.id]}</ErrorText>
                )}
              </QuestionCard>
            ))}
          </QuestionsList>

          <SubmitSection>
            <BackButton onClick={handleBack}>
              ← Back to Quizzes
            </BackButton>
            <SubmitButton
              onClick={handleSubmit}
              disabled={loading.isSubmitAnatomyQuizLoading}
            >
              {loading.isSubmitAnatomyQuizLoading ? 'Submitting...' : 'Submit Answers'}
            </SubmitButton>
          </SubmitSection>
        </QuestionsSection>
      </QuizContainer>
    </Container>
  )
}

export default QuizDetail
