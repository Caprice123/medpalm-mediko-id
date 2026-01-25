import React, { useMemo } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Content,
  QuizForm,
  FormHeader,
  HeaderTop,
  TopicInfo,
  TagList,
  Tag,
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
  CelebrationHeader,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
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

    // Filter tags by tag group
    const universityTags = useMemo(() => {
        return (currentQuiz?.tags || []).filter(tag => tag.tagGroupId === 4)
    }, [currentQuiz?.tags])

    const semesterTags = useMemo(() => {
        return (currentQuiz?.tags || []).filter(tag => tag.tagGroupId === 5)
    }, [currentQuiz?.tags])

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
                <FormHeader>
                    <HeaderTop>
                        <Button onClick={handleBack}>
                            ← Kembali
                        </Button>
                    </HeaderTop>

                    <TopicInfo>
                        <h2>🧬 {currentQuiz.title}</h2>
                        {currentQuiz.description && <p>{currentQuiz.description}</p>}

                        {/* University Tags */}
                        {universityTags.length > 0 && (
                            <TagList>
                                {universityTags.map((tag) => (
                                    <Tag key={tag.id} university>
                                        {tag.name}
                                    </Tag>
                                ))}
                            </TagList>
                        )}

                        {/* Semester Tags */}
                        {semesterTags.length > 0 && (
                            <TagList>
                                {semesterTags.map((tag) => (
                                    <Tag key={tag.id} semester>
                                        {tag.name}
                                    </Tag>
                                ))}
                            </TagList>
                        )}
                    </TopicInfo>
                </FormHeader>

            <QuizForm>
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

                              {/* Render different UI based on answer type */}
                              {question.answerType === 'multiple_choice' && question.choices && question.choices.length > 0 ? (
                                // Multiple Choice - Render radio buttons with letter labels
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                                  {question.choices.map((choice, choiceIndex) => (
                                    <label
                                      key={choiceIndex}
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '0.875rem',
                                        border: '2px solid',
                                        borderColor: answers[question.id] === choice ? '#6BB9E8' : '#E5E7EB',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        transition: 'all 0.2s',
                                        backgroundColor: answers[question.id] === choice ? '#F0F9FF' : 'white'
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
                                        onChange={(e) => handleInputChange(question.id, e.target.value)}
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
                                        minWidth: '28px',
                                        marginRight: '0.75rem',
                                        fontSize: '0.9375rem'
                                      }}>
                                        {String.fromCharCode(65 + choiceIndex)}.
                                      </span>
                                      <span style={{ color: '#1F2937', fontSize: '0.9375rem', flex: 1 }}>{choice}</span>
                                    </label>
                                  ))}
                                </div>
                              ) : (
                                // Text Input - Render text input field
                                <QuestionInput
                                  type="text"
                                  value={answers[question.id] || ''}
                                  onChange={(e) => handleInputChange(question.id, e.target.value)}
                                  placeholder="Masukkan jawaban Anda..."
                                />
                              )}

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
                        <CelebrationHeader>
                          🎉 Kuis Selesai! 🎉
                        </CelebrationHeader>

                        <ScoreDisplay>
                          {quizResult.score}%
                        </ScoreDisplay>
                        <ScoreLabel>
                          {quizResult.correctAnswers} dari {quizResult.totalQuestions} jawaban benar
                        </ScoreLabel>

                        <StatsGrid>
                          <StatCard type="correct">
                            <StatIcon>✓</StatIcon>
                            <StatValue type="correct">{quizResult.correctAnswers}</StatValue>
                            <StatLabel>Benar</StatLabel>
                          </StatCard>

                          <StatCard type="wrong">
                            <StatIcon>✗</StatIcon>
                            <StatValue type="wrong">{quizResult.totalQuestions - quizResult.correctAnswers}</StatValue>
                            <StatLabel>Salah</StatLabel>
                          </StatCard>

                          <StatCard type="info">
                            <StatIcon>📊</StatIcon>
                            <StatValue type="info">{quizResult.totalQuestions}</StatValue>
                            <StatLabel>Total Soal</StatLabel>
                          </StatCard>
                        </StatsGrid>
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
