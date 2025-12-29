import React from 'react'
import {
  Container,
  Content,
  QuizContainer,
  Header,
  Title,
  Description,
  QuizInfo,
  InfoItem,
  Timer,
  ProgressBar,
  ProgressFill,
  QuestionCard,
  QuestionText,
  OptionsContainer,
  OptionButton,
  OptionLabel,
  OptionText,
  OptionIcon,
  ExplanationBox,
  ExplanationLabel,
  ExplanationText,
  ActionButtons,
  ResultContainer,
  ResultScore,
  ResultLabel,
  ResultStatus,
  AnswerReview,
  ReviewTitle,
  ReviewItem,
  ReviewQuestion,
  ReviewAnswer,
  LoadingSpinner
} from './Detail.styles'
import Button from '@components/common/Button'
import { useMultipleChoiceDetail } from './useMultipleChoiceDetail'

const Detail = () => {
  const {
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
    formatTimer,
    totalQuestions,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleNextQuestionQuiz,
    handleQuizSubmit,
    handleBack
  } = useMultipleChoiceDetail()

  if (!currentTopic) {
    return (
      <Container>
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat topik...</p>
          </div>
        </Content>
      </Container>
    )
  }

  // Show results
  if (quizResult) {
    return (
      <Container>
        <Content>
          <QuizContainer>
            <Header>
              <Button
                variant="outline"
                onClick={handleBack}
                style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
              >
                ← Back
              </Button>
              <div style={{ flex: 1, marginLeft: '1rem' }}>
                <Title>{currentTopic.title}</Title>
              </div>
            </Header>

            <ResultContainer>
              <ResultScore>{quizResult.score}%</ResultScore>
              <ResultLabel>
                {quizResult.correct_questions} dari {quizResult.totalQuestions} jawaban benar
              </ResultLabel>
              <ResultStatus passed={quizResult.passed}>
                {quizResult.passed ? '✅ Lulus!' : '❌ Belum Lulus'}
              </ResultStatus>
            </ResultContainer>

            <AnswerReview>
              <ReviewTitle>Review Jawaban</ReviewTitle>
              {quizResult.answers?.map((answer, index) => (
                <ReviewItem key={index} isCorrect={answer.isCorrect}>
                  <ReviewQuestion>
                    {index + 1}. {answer.question}
                  </ReviewQuestion>
                  <ReviewAnswer>
                    <strong>Jawaban Anda:</strong>
                    <span>
                      {answer.userAnswer !== null && answer.options?.[answer.userAnswer]
                        ? `${String.fromCharCode(65 + answer.userAnswer)}. ${answer.options[answer.userAnswer]}`
                        : 'Tidak dijawab'}
                      {answer.isCorrect ? ' ✓' : ' ✗'}
                    </span>
                  </ReviewAnswer>
                  {!answer.isCorrect && (
                    <ReviewAnswer>
                      <strong>Jawaban Benar:</strong>
                      <span>
                        {String.fromCharCode(65 + answer.correct_answer)}. {answer.options?.[answer.correct_answer]}
                      </span>
                    </ReviewAnswer>
                  )}
                  {answer.explanation && (
                    <ExplanationBox isCorrect={answer.isCorrect}>
                      <ExplanationLabel isCorrect={answer.isCorrect}>
                        💡 Penjelasan
                      </ExplanationLabel>
                      <ExplanationText>{answer.explanation}</ExplanationText>
                    </ExplanationBox>
                  )}
                </ReviewItem>
              ))}
            </AnswerReview>

            <ActionButtons>
              <Button
                variant="primary"
                onClick={handleBack}
                style={{ width: '100%', padding: '1rem' }}
              >
                Kembali ke Daftar Topik
              </Button>
            </ActionButtons>
          </QuizContainer>
        </Content>
      </Container>
    )
  }

  // Learning or Quiz mode
  const progress = totalQuestions > 0 ? ((currentQuestionIndex + 1) / totalQuestions) * 100 : 0
  const selectedAnswer = answers[currentQuestion?.id]
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer
  const allQuestionsAnswered = currentTopic?.mcq_questions?.every(q => answers[q.id] !== undefined)

  return (
    <Container>
      <Content>
        <QuizContainer>
          <Header>
            <Button
              variant="outline"
              onClick={handleBack}
              style={{ minWidth: '44px', padding: '0.5rem 1rem' }}
            >
              ← Back
            </Button>
            <div style={{ flex: 1, marginLeft: '1rem' }}>
              <Title>{currentTopic.title}</Title>
              {currentTopic.description && (
                <Description>{currentTopic.description}</Description>
              )}
            </div>
          </Header>

          <QuizInfo>
            <InfoItem>
              {mode === 'learning' ? '📖 Learning Mode' : '⏱️ Quiz Mode'}
            </InfoItem>
            <InfoItem>
              📊 Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </InfoItem>
            {mode === 'quiz' && timerActive && currentTopic.quiz_time_limit > 0 && (
              <Timer warning={timer < 60}>
                ⏰ {formatTimer(timer)}
              </Timer>
            )}
          </QuizInfo>

          <ProgressBar>
            <ProgressFill progress={progress} />
          </ProgressBar>

          {currentQuestion && (
            <QuestionCard>
              <QuestionText>
                {currentQuestionIndex + 1}. {currentQuestion.question}
              </QuestionText>

              <OptionsContainer>
                {currentQuestion.options?.map((option, index) => {
                  const isSelected = selectedAnswer === index
                  const isThisCorrect = index === currentQuestion.correct_answer
                  const showResult = mode === 'learning' && showExplanation

                  return (
                    <OptionButton
                      key={index}
                      selected={isSelected}
                      isCorrect={isThisCorrect}
                      showResult={showResult}
                      disabled={mode === 'learning' && showExplanation}
                      onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                    >
                      <OptionLabel
                        selected={isSelected}
                        isCorrect={isThisCorrect}
                        showResult={showResult}
                      >
                        {String.fromCharCode(65 + index)}
                      </OptionLabel>
                      <OptionText>{option}</OptionText>
                      {showResult && isThisCorrect && <OptionIcon>✓</OptionIcon>}
                      {showResult && isSelected && !isThisCorrect && <OptionIcon>✗</OptionIcon>}
                    </OptionButton>
                  )
                })}
              </OptionsContainer>

              {mode === 'learning' && showExplanation && currentQuestion.explanation && (
                <ExplanationBox isCorrect={isCorrect}>
                  <ExplanationLabel isCorrect={isCorrect}>
                    {isCorrect ? '✅ Benar!' : '❌ Kurang Tepat'}
                  </ExplanationLabel>
                  <ExplanationText>{currentQuestion.explanation}</ExplanationText>
                </ExplanationBox>
              )}
            </QuestionCard>
          )}

          <ActionButtons>
            {mode === 'learning' ? (
              showExplanation ? (
                <Button
                  variant="primary"
                  onClick={handleNextQuestion}
                  style={{ width: '100%', padding: '1rem' }}
                >
                  {currentQuestionIndex < totalQuestions - 1 ? 'Soal Selanjutnya →' : 'Selesai'}
                </Button>
              ) : (
                <Button
                  variant="outline"
                  disabled
                  style={{ width: '100%', padding: '1rem', opacity: 0.5 }}
                >
                  Pilih jawaban untuk melanjutkan
                </Button>
              )
            ) : (
              <>
                {/* Navigation buttons for Quiz mode */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                  {currentQuestionIndex > 0 && (
                    <Button
                      variant="outline"
                      onClick={handlePreviousQuestion}
                      style={{ flex: 1, padding: '1rem' }}
                    >
                      ← Soal Sebelumnya
                    </Button>
                  )}
                  {currentQuestionIndex < totalQuestions - 1 ? (
                    <Button
                      variant="primary"
                      onClick={handleNextQuestionQuiz}
                      style={{ flex: 1, padding: '1rem' }}
                    >
                      Soal Selanjutnya →
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      onClick={handleQuizSubmit}
                      disabled={!allQuestionsAnswered || loading.isSubmitAnatomyQuizLoading}
                      style={{ flex: 1, padding: '1rem' }}
                    >
                      {loading.isSubmitAnatomyQuizLoading ? 'Mengirim...' : 'Kirim Jawaban'}
                    </Button>
                  )}
                </div>
              </>
            )}
          </ActionButtons>
        </QuizContainer>
      </Content>
    </Container>
  )
}

export default Detail
