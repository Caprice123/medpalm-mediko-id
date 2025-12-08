import React, { useEffect, useState } from 'react'
import {
  Container,
  Content,
  QuizForm,
  FormHeader,
  FormTitle,
  FormDescription,
  QuizMainContent,
  QuizImageSection,
  QuizImage,
  QuestionsContainer,
  QuestionsSection,
  SubmitButtonContainer,
  SectionTitle,
  QuestionCard,
  QuestionLabel,
  QuestionInput,
  ResultSection,
  ResultHeader,
  ScoreDisplay,
  ScoreLabel,
  AnswersReview,
  AnswerCard,
  AnswerQuestion,
  AnswerRow,
  AnswerItem,
  AnswerItemLabel,
  AnswerItemValue,
  Explanation,
  ExplanationLabel,
  ExplanationText,
  ErrorMessage,
  LoadingSpinner
} from './Detail.styles'
import Button from '@components/common/Button'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAnatomyQuizForUser, submitAnatomyQuizAnswers } from '@store/anatomy/action'
import { useNavigate, useParams } from 'react-router-dom'

const AnatomyQuizDetail = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const { id } = useParams()
    const { currentQuiz, quizResult, loading } = useSelector(state => state.anatomy)
    const [answers, setAnswers] = useState({})
    const [formErrors, setFormErrors] = useState({})

    useEffect(() => {
        dispatch(fetchAnatomyQuizForUser(id))
    }, [dispatch, id])

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

        await dispatch(submitAnatomyQuizAnswers(id, formattedAnswers))
      }

      if (!currentQuiz) {
        return (
          <Container>
            <Content>
              <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                <LoadingSpinner style={{ width: '40px', height: '40px', border: '4px solid rgba(107, 185, 232, 0.2)', borderTopColor: '#6BB9E8' }} />
                <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat quiz...</p>
              </div>
            </Content>
          </Container>
        )
      }

    return (
        <Container>
            <Content>
            <QuizForm>
                <FormHeader>
                <Button
                    variant="outline"
                    onClick={() => navigate(-1)}
                    style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
                >
                    ← Back
                </Button>
                <div style={{ flex: 1, marginLeft: '1rem' }}>
                    <FormTitle>{currentQuiz.title}</FormTitle>
                    {currentQuiz.description && (
                    <FormDescription>{currentQuiz.description}</FormDescription>
                    )}
                </div>
                </FormHeader>

                {!quizResult ? (
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                    <QuizMainContent>
                      {/* Quiz Image - Left Side */}
                      {currentQuiz.image_url && (
                        <QuizImageSection>
                          <QuizImage src={currentQuiz.image_url} alt={currentQuiz.title} />
                        </QuizImageSection>
                      )}

                      {/* Questions - Right Side (Scrollable) */}
                      <QuestionsContainer>
                        <SectionTitle>Identifikasi Bagian Anatomi</SectionTitle>
                        <QuestionsSection>
                          {currentQuiz.anatomy_questions?.map((question) => (
                            <QuestionCard key={question.id}>
                              <QuestionLabel>
                                {question.label}
                                <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                              </QuestionLabel>
                              <QuestionInput
                                type="text"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                placeholder="Masukkan jawaban Anda..."
                              />
                              {formErrors[question.id] && (
                                <ErrorMessage>
                                  {formErrors[question.id]}
                                </ErrorMessage>
                              )}
                            </QuestionCard>
                          ))}
                        </QuestionsSection>

                        <SubmitButtonContainer>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading.isSubmitting}
                            style={{
                              width: '100%',
                              padding: '1rem',
                              fontSize: '1rem',
                              fontWeight: 600
                            }}
                          >
                            {loading.isSubmitting ? 'Mengirim...' : 'Kirim Jawaban'}
                          </Button>
                        </SubmitButtonContainer>
                      </QuestionsContainer>
                    </QuizMainContent>
                  </form>
                ) : (
                  <ResultSection>
                    <ResultHeader>
                      <ScoreDisplay>
                        {quizResult.score}%
                      </ScoreDisplay>
                      <ScoreLabel>
                        {quizResult.correctAnswers} dari {quizResult.totalQuestions} jawaban benar
                      </ScoreLabel>
                    </ResultHeader>

                    <AnswersReview>
                      {quizResult.answers?.map((answer, index) => (
                        <AnswerCard key={index} isCorrect={answer.isCorrect}>
                          <AnswerQuestion>
                            {index + 1}. {answer.question}
                          </AnswerQuestion>
                          <AnswerRow>
                            <AnswerItem>
                              <AnswerItemLabel>Jawaban Anda:</AnswerItemLabel>
                              <AnswerItemValue type={answer.isCorrect ? 'correct' : 'wrong'}>
                                {answer.userAnswer || '-'}
                                {answer.isCorrect ? ' ✓' : ' ✗'}
                              </AnswerItemValue>
                            </AnswerItem>
                            {!answer.isCorrect && (
                              <AnswerItem>
                                <AnswerItemLabel>Jawaban Benar:</AnswerItemLabel>
                                <AnswerItemValue type="correct">
                                  {answer.correctAnswer}
                                </AnswerItemValue>
                              </AnswerItem>
                            )}
                          </AnswerRow>
                          {answer.explanation && (
                            <Explanation>
                              <ExplanationLabel>Penjelasan</ExplanationLabel>
                              <ExplanationText>{answer.explanation}</ExplanationText>
                            </Explanation>
                          )}
                        </AnswerCard>
                      ))}
                    </AnswersReview>

                    <Button
                      variant="primary"
                      onClick={() => navigate(-1)}
                      style={{
                        width: '100%',
                        marginTop: '2rem',
                        padding: '1rem',
                        fontSize: '1rem',
                        fontWeight: 600
                      }}
                    >
                      Kembali ke Daftar Quiz
                    </Button>
                  </ResultSection>
                )}
            </QuizForm>
            </Content>
        </Container>
    )
}

export default AnatomyQuizDetail
