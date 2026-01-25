import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'
import {
  fetchDetailAnatomyQuiz,
  submitAnatomyQuizAnswers,
} from '@store/anatomy/action'
import Button from '@components/common/Button'
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
  LoadingOverlay,
  ErrorMessage,
  SubscriptionGate,
  GateIcon,
  GateTitle,
  GateText,
} from './QuizDetail.styles'

function QuizDetail() {
  const { id } = useParams()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { detail: currentQuiz, loading } = useSelector(state => state.anatomy)

  const [answers, setAnswers] = useState({})
  const [errors, setErrors] = useState({})
  const [imageZoomed, setImageZoomed] = useState(false)
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

  // Show error message
  if (errorMessage) {
    return (
      <Container>
        <ErrorMessage>
          <h3 style={{ marginBottom: '1rem' }}>Error</h3>
          <p>{errorMessage}</p>
          <Button
            variant="secondary"
            onClick={handleBack}
            style={{ marginTop: '1.5rem' }}
          >
            Kembali
          </Button>
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

                {/* Render different UI based on answer type */}
                {question.answerType === 'multiple_choice' && question.choices && question.choices.length > 0 ? (
                  // Multiple Choice - Render radio buttons with letter labels
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
                    {question.choices.map((choice, choiceIndex) => (
                      <label
                        key={choiceIndex}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.75rem',
                          border: '2px solid',
                          borderColor: answers[question.id] === choice ? '#6BB9E8' : '#E5E7EB',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                          backgroundColor: answers[question.id] === choice ? '#F0F9FF' : 'transparent'
                        }}
                        onMouseEnter={(e) => {
                          if (answers[question.id] !== choice) {
                            e.currentTarget.style.borderColor = '#CBD5E1'
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (answers[question.id] !== choice) {
                            e.currentTarget.style.borderColor = '#E5E7EB'
                          }
                        }}
                      >
                        <input
                          type="radio"
                          name={`question_${question.id}`}
                          value={choice}
                          checked={answers[question.id] === choice}
                          onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                          style={{
                            marginRight: '0.75rem',
                            width: '18px',
                            height: '18px',
                            cursor: 'pointer'
                          }}
                        />
                        <span style={{
                          fontWeight: '700',
                          color: answers[question.id] === choice ? '#6BB9E8' : '#374151',
                          minWidth: '24px',
                          marginRight: '0.75rem'
                        }}>
                          {String.fromCharCode(65 + choiceIndex)}.
                        </span>
                        <span style={{ color: '#1F2937', fontSize: '0.95rem', flex: 1 }}>{choice}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  // Text Input - Render text input field
                  <AnswerInput
                    type="text"
                    value={answers[question.id] || ''}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Type your answer here..."
                  />
                )}

                {errors[question.id] && (
                  <ErrorText>{errors[question.id]}</ErrorText>
                )}
              </QuestionCard>
            ))}
          </QuestionsList>

          <SubmitSection>
            <Button variant="secondary" onClick={handleBack}>
              ← Kembali
            </Button>
            <Button
              variant="primary"
              onClick={handleSubmit}
              disabled={loading.isSubmitAnatomyQuizLoading}
            >
              {loading.isSubmitAnatomyQuizLoading ? 'Submitting...' : 'Submit Answers'}
            </Button>
          </SubmitSection>
        </QuestionsSection>
      </QuizContainer>
    </Container>
  )
}

export default QuizDetail
