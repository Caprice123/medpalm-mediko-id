import React from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
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
  ErrorText,
  LoadingSpinner,
  ResultScoreSection
} from './Detail.styles'
import Button from '@components/common/Button'
import { useAnatomyQuizDetail } from './useAnatomyQuizDetail'

const AnatomyQuizDetail = () => {
    const {
        currentQuiz,
        quizResult,
        loading,
        answers,
        formErrors,
        sectionTitle,
        handleInputChange,
        handleSubmit,
        handleBack
    } = useAnatomyQuizDetail()

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
                    onClick={handleBack}
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
                  <PhotoProvider>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                      <QuizMainContent>
                        {/* Quiz Image - Left Side */}
                        {currentQuiz.imageUrl && (
                          <QuizImageSection>
                            <PhotoView src={currentQuiz.imageUrl}>
                              <QuizImage src={currentQuiz.imageUrl} alt={currentQuiz.title} />
                            </PhotoView>
                          </QuizImageSection>
                        )}

                      {/* Questions - Right Side (Scrollable) */}
                      <QuestionsContainer>
                        <SectionTitle>{sectionTitle}</SectionTitle>
                        <QuestionsSection>
                          {currentQuiz.anatomy_questions?.map((question) => (
                            <QuestionCard key={question.id}>
                              <QuestionLabel>
                                {question.question}
                                <span style={{ color: '#ef4444', marginLeft: '4px' }}>*</span>
                              </QuestionLabel>
                              <QuestionInput
                                type="text"
                                value={answers[question.id] || ''}
                                onChange={(e) => handleInputChange(question.id, e.target.value)}
                                placeholder="Masukkan jawaban Anda..."
                              />
                              {formErrors[question.id] && (
                                <ErrorText>{formErrors[question.id]}</ErrorText>
                              )}
                            </QuestionCard>
                          ))}
                        </QuestionsSection>

                        <SubmitButtonContainer>
                          <Button
                            variant="primary"
                            type="submit"
                            disabled={loading.isSubmitAnatomyQuizLoading}
                            style={{
                              width: '100%',
                              padding: '1rem',
                              fontSize: '1rem',
                              fontWeight: 600
                            }}
                          >
                            {loading.isSubmitAnatomyQuizLoading ? 'Mengirim...' : 'Kirim Jawaban'}
                          </Button>
                        </SubmitButtonContainer>
                      </QuestionsContainer>
                    </QuizMainContent>
                  </form>
                  </PhotoProvider>
                ) : (
                  <PhotoProvider>
                  <>
                    <ResultHeader>
                      <ResultScoreSection>
                        <ScoreDisplay>
                          {quizResult.score}%
                        </ScoreDisplay>
                        <ScoreLabel>
                          {quizResult.correct_questions} dari {quizResult.totalQuestions} jawaban benar
                        </ScoreLabel>
                      </ResultScoreSection>
                      <Button
                        variant="primary"
                        onClick={handleBack}
                        style={{
                          maxWidth: '300px',
                          margin: '0 auto',
                          padding: '0.875rem 2rem',
                          fontSize: '0.9375rem',
                          fontWeight: 600,
                          border: 'none',
                          color: 'white'
                        }}
                      >
                        ← Kembali ke Daftar Quiz
                      </Button>
                    </ResultHeader>

                    <QuizMainContent>
                      {/* Quiz Image - Left Side */}
                      {currentQuiz.imageUrl && (
                        <QuizImageSection>
                          <PhotoView src={currentQuiz.imageUrl}>
                            <QuizImage src={currentQuiz.imageUrl} alt={currentQuiz.title} />
                          </PhotoView>
                        </QuizImageSection>
                      )}

                      {/* Results - Right Side (Scrollable) */}
                      <QuestionsContainer>
                        <AnswersReview>
                          {quizResult.answers?.map((answer, index) => (
                            <AnswerCard key={index} isCorrect={answer.isCorrect}>
                              <AnswerQuestion>
                                {answer.question || 'Pertanyaan tidak tersedia'}
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
                            </AnswerCard>
                          ))}
                        </AnswersReview>
                      </QuestionsContainer>
                    </QuizMainContent>
                  </>
                  </PhotoProvider>
                )}
            </QuizForm>
            </Content>
        </Container>
    )
}

export default AnatomyQuizDetail
