import {
  Container,
  Header,
  ResultCard,
  ScoreCircle,
  ScoreText,
  ScoreLabel,
  ResultStatus,
  StatusText,
  ResultSummary,
  SummaryItem,
  SummaryLabel,
  SummaryValue,
  QuestionReview,
  ReviewTitle,
  QuestionCard,
  QuestionHeader,
  QuestionNumber,
  ResultBadge,
  QuestionText,
  QuestionImage,
  OptionsReview,
  OptionReviewCard,
  OptionLabel,
  OptionText,
  ExplanationBox,
  ExplanationTitle,
  ExplanationText,
  ActionsContainer,
  RetryButton,
  BackButton
} from './QuizResults.styles'

const QuizResults = ({ topic, answers, onRetry, onBack }) => {
  const questions = topic.mcq_questions || []
  const totalQuestions = questions.length
  const correctAnswers = answers.filter(a => a.isCorrect).length
  const incorrectAnswers = totalQuestions - correctAnswers
  const score = Math.round((correctAnswers / totalQuestions) * 100)
  const passed = score >= topic.passing_score

  return (
    <Container>
      <Header>
        <ResultCard passed={passed}>
          <ScoreCircle passed={passed}>
            <ScoreText>{score}%</ScoreText>
            <ScoreLabel>Nilai Akhir</ScoreLabel>
          </ScoreCircle>

          <ResultStatus>
            <StatusText passed={passed}>
              {passed ? '✅ Lulus!' : '❌ Belum Lulus'}
            </StatusText>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>
              Passing Score: {topic.passing_score}%
            </div>
          </ResultStatus>

          <ResultSummary>
            <SummaryItem>
              <SummaryLabel>Total Soal</SummaryLabel>
              <SummaryValue>{totalQuestions}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Benar</SummaryLabel>
              <SummaryValue style={{ color: '#10b981' }}>{correctAnswers}</SummaryValue>
            </SummaryItem>
            <SummaryItem>
              <SummaryLabel>Salah</SummaryLabel>
              <SummaryValue style={{ color: '#ef4444' }}>{incorrectAnswers}</SummaryValue>
            </SummaryItem>
          </ResultSummary>
        </ResultCard>
      </Header>

      <QuestionReview>
        <ReviewTitle>Pembahasan Soal</ReviewTitle>

        {questions.map((question, qIndex) => {
          const answer = answers.find(a => a.question_id === question.id)
          const isCorrect = answer?.isCorrect

          return (
            <QuestionCard key={question.id} correct={isCorrect}>
              <QuestionHeader>
                <QuestionNumber>
                  Soal {qIndex + 1}
                </QuestionNumber>
                <ResultBadge correct={isCorrect}>
                  {isCorrect ? '✓ Benar' : '✗ Salah'}
                </ResultBadge>
              </QuestionHeader>

              <QuestionText>{question.question}</QuestionText>

              {question.imageUrl && (
                <QuestionImage src={question.imageUrl} alt="Question" />
              )}

              <OptionsReview>
                {question.options?.map((option, optIndex) => {
                  const isUserAnswer = answer?.userAnswer === optIndex
                  const isCorrectOption = question.correct_answer === optIndex

                  return (
                    <OptionReviewCard
                      key={optIndex}
                      userAnswer={isUserAnswer}
                      correctAnswer={isCorrectOption}
                    >
                      <OptionLabel
                        userAnswer={isUserAnswer}
                        correctAnswer={isCorrectOption}
                      >
                        {String.fromCharCode(65 + optIndex)}
                      </OptionLabel>
                      <OptionText>{option}</OptionText>
                      {isUserAnswer && !isCorrectOption && (
                        <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>❌</span>
                      )}
                      {isCorrectOption && (
                        <span style={{ marginLeft: 'auto', fontSize: '1.25rem' }}>✅</span>
                      )}
                    </OptionReviewCard>
                  )
                })}
              </OptionsReview>

              {question.explanation && (
                <ExplanationBox>
                  <ExplanationTitle>💡 Penjelasan</ExplanationTitle>
                  <ExplanationText>{question.explanation}</ExplanationText>
                </ExplanationBox>
              )}
            </QuestionCard>
          )
        })}
      </QuestionReview>

      <ActionsContainer>
        <BackButton onClick={onBack}>
          ← Kembali ke Daftar
        </BackButton>
        <RetryButton onClick={onRetry}>
          🔄 Coba Lagi
        </RetryButton>
      </ActionsContainer>
    </Container>
  )
}

export default QuizResults
