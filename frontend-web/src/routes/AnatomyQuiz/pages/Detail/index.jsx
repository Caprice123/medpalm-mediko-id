import React from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Content,
  QuizForm,
  FormTitle,
  FormDescription,
  QuizMainContent,
  QuizImageSection,
  QuizImage,
  EmbedFrame,
  QuestionsContainer,
  QuestionsSection,
  SubmitButtonContainer,
  SectionTitle,
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
  LoadingSpinner,
  ResultScoreSection
} from './Detail.styles'
import Button from '@components/common/Button'
import QuizHeader from '../../components/QuizHeader'
import QuestionItem from '../../components/QuestionItem'
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
                        <LoadingSpinner />
                        <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat quiz...</p>
                    </div>
                </Content>
            </Container>
        )
    }

    return (
        <Container>
            <Content>
                <QuizHeader quiz={currentQuiz} onBack={handleBack} />

                <QuizForm>
                    {!quizResult ? (
                        currentQuiz.embedUrl && (!currentQuiz.anatomy_questions || currentQuiz.anatomy_questions.length === 0) ? (
                            <QuizMainContent>
                                <QuizImageSection style={{ flex: '1 1 100%' }}>
                                    <EmbedFrame
                                        src={currentQuiz.embedUrl}
                                        title={currentQuiz.title}
                                        allowFullScreen
                                        allow="fullscreen"
                                    />
                                </QuizImageSection>
                            </QuizMainContent>
                        ) : (
                        <PhotoProvider>
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
                                <QuizMainContent>
                                    {(currentQuiz.embedUrl || currentQuiz.imageUrl) && (
                                        <QuizImageSection>
                                            {currentQuiz.embedUrl ? (
                                                <EmbedFrame
                                                    src={currentQuiz.embedUrl}
                                                    title={currentQuiz.title}
                                                    allowFullScreen
                                                    allow="fullscreen"
                                                />
                                            ) : (
                                                <PhotoView src={currentQuiz.imageUrl}>
                                                    <QuizImage src={currentQuiz.imageUrl} alt={currentQuiz.title} />
                                                </PhotoView>
                                            )}
                                        </QuizImageSection>
                                    )}

                                    <QuestionsContainer>
                                        <SectionTitle>{sectionTitle}</SectionTitle>
                                        <QuestionsSection>
                                            {currentQuiz.anatomy_questions?.map((question) => (
                                                <QuestionItem
                                                    key={question.id}
                                                    question={question}
                                                    value={answers[question.id] || ''}
                                                    onChange={handleInputChange}
                                                    error={formErrors[question.id]}
                                                />
                                            ))}
                                        </QuestionsSection>

                                        <SubmitButtonContainer>
                                            <Button
                                                variant="primary"
                                                type="submit"
                                                disabled={loading.isSubmitAnatomyQuizLoading}
                                                style={{ width: '100%', padding: '1rem', fontSize: '1rem', fontWeight: 600 }}
                                            >
                                                {loading.isSubmitAnatomyQuizLoading ? 'Mengirim...' : 'Kirim Jawaban'}
                                            </Button>
                                        </SubmitButtonContainer>
                                    </QuestionsContainer>
                                </QuizMainContent>
                            </form>
                        </PhotoProvider>
                        )
                    ) : (
                        <PhotoProvider>
                            <>
                                <ResultHeader>
                                    <ResultScoreSection>
                                        <CelebrationHeader>🎉 Kuis Selesai! 🎉</CelebrationHeader>
                                        <ScoreDisplay>{quizResult.score}%</ScoreDisplay>
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
                                        style={{ maxWidth: '300px', margin: '0 auto', padding: '0.875rem 2rem', fontSize: '0.9375rem', fontWeight: 600, border: 'none', color: 'white' }}
                                    >
                                        ← Kembali ke Daftar Quiz
                                    </Button>
                                </ResultHeader>

                                <QuizMainContent>
                                    {(currentQuiz.embedUrl || currentQuiz.imageUrl) && (
                                        <QuizImageSection>
                                            {currentQuiz.embedUrl ? (
                                                <EmbedFrame
                                                    src={currentQuiz.embedUrl}
                                                    title={currentQuiz.title}
                                                    allowFullScreen
                                                    allow="fullscreen"
                                                />
                                            ) : (
                                                <PhotoView src={currentQuiz.imageUrl}>
                                                    <QuizImage src={currentQuiz.imageUrl} alt={currentQuiz.title} />
                                                </PhotoView>
                                            )}
                                        </QuizImageSection>
                                    )}

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
