import React, { useMemo } from 'react'
import {
  Container,
  Content,
  QuizContainer,
  Header,
  HeaderTop,
  BackButton,
  TopicInfo,
  TagList,
  Tag,
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
  CelebrationHeader,
  ResultScore,
  ResultLabel,
  StatsGrid,
  StatCard,
  StatIcon,
  StatValue,
  StatLabel,
  Divider,
  AnswerReview,
  ReviewTitle,
  ReviewItem,
  ReviewBadge,
  ReviewQuestion,
  ReviewAnswer,
  ReturnButton,
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

  // Filter tags by tag group
  const universityTags = useMemo(() => {
    return (currentTopic?.tags || []).filter(tag => tag.tagGroupId === 4)
  }, [currentTopic?.tags])

  const semesterTags = useMemo(() => {
    return (currentTopic?.tags || []).filter(tag => tag.tagGroupId === 5)
  }, [currentTopic?.tags])

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
          <Header>
            <HeaderTop>
              <BackButton onClick={handleBack}>
                ← Kembali
              </BackButton>
            </HeaderTop>

            <TopicInfo>
              <h2>📝 {currentTopic.title}</h2>
              {currentTopic.description && <p>{currentTopic.description}</p>}

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
          </Header>

          <QuizContainer>
            <ResultContainer>
              <CelebrationHeader>
                🎉 Kuis Selesai! 🎉
              </CelebrationHeader>

              <ResultScore>{quizResult.score}%</ResultScore>
              <ResultLabel>
                {quizResult.correctQuestions} dari {quizResult.totalQuestions} jawaban benar
              </ResultLabel>

              <StatsGrid>
                <StatCard type="correct">
                  <StatIcon>✓</StatIcon>
                  <StatValue type="correct">{quizResult.correctQuestions}</StatValue>
                  <StatLabel>Benar</StatLabel>
                </StatCard>

                <StatCard type="wrong">
                  <StatIcon>✗</StatIcon>
                  <StatValue type="wrong">{quizResult.totalQuestions - quizResult.correctQuestions}</StatValue>
                  <StatLabel>Salah</StatLabel>
                </StatCard>

                <StatCard type="info">
                  <StatIcon>📊</StatIcon>
                  <StatValue type="info">{quizResult.totalQuestions}</StatValue>
                  <StatLabel>Total Soal</StatLabel>
                </StatCard>
              </StatsGrid>
            </ResultContainer>

            <Divider />

            <AnswerReview>
              <ReviewTitle>📋 Review Jawaban</ReviewTitle>
              {quizResult.answers?.map((answer, index) => (
                <ReviewItem key={index} isCorrect={answer.is_correct}>
                  <ReviewBadge>
                    {answer.is_correct ? '✓' : '✗'}
                  </ReviewBadge>

                  <ReviewQuestion>
                    {index + 1}. {answer.question}
                  </ReviewQuestion>

                  <ReviewAnswer>
                    <strong>{answer.is_correct ? '💚 Jawaban:' : '❌ Jawaban Anda:'}</strong>
                    <span>
                      {answer.user_answer !== null && answer.options?.[answer.user_answer]
                        ? `${String.fromCharCode(65 + answer.user_answer)}. ${answer.options[answer.user_answer]}`
                        : 'Tidak dijawab'}
                      {answer.is_correct && <span>✓</span>}
                    </span>
                  </ReviewAnswer>

                  {!answer.is_correct && (
                    <ReviewAnswer>
                      <strong>✓ Jawaban Benar:</strong>
                      <span>
                        {String.fromCharCode(65 + answer.correct_answer)}. {answer.options?.[answer.correct_answer]}
                      </span>
                    </ReviewAnswer>
                  )}

                  {answer.explanation && (
                    <ExplanationBox isCorrect={answer.is_correct}>
                      <ExplanationLabel isCorrect={answer.is_correct}>
                        💡 Penjelasan
                      </ExplanationLabel>
                      <ExplanationText>{answer.explanation}</ExplanationText>
                    </ExplanationBox>
                  )}
                </ReviewItem>
              ))}
            </AnswerReview>

            <ReturnButton onClick={handleBack}>
              🏠 Kembali ke Daftar Topik
            </ReturnButton>
          </QuizContainer>
        </Content>
      </Container>
    )
  }

  // Learning or Quiz mode
  const selectedAnswer = answers[currentQuestion?.id]
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer
  const allQuestionsAnswered = currentTopic?.mcq_questions?.every(q => answers[q.id] !== undefined)

  return (
    <Container>
      <Content>
        <Header>
          <HeaderTop>
            <BackButton onClick={handleBack}>
              ← Kembali
            </BackButton>
          </HeaderTop>

          <TopicInfo>
            <h2>📝 {currentTopic.title}</h2>
            {currentTopic.description && <p>{currentTopic.description}</p>}

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
        </Header>

        <QuizContainer>
          <QuizInfo>
            <InfoItem>
              {mode === 'learning' ? '📖 Learning Mode' : '⏱️ Quiz Mode'}
            </InfoItem>
            {mode === 'quiz' && timerActive && currentTopic.quizTimeLimit > 0 && (
              <Timer warning={timer < 60}>
                ⏰ {formatTimer(timer)}
              </Timer>
            )}
            <InfoItem>
              📊 Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
            </InfoItem>
          </QuizInfo>

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
