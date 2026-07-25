import {
  Header,
  HeaderTop,
  TopicInfo,
  QuizContainer,
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
  ExplanationBox,
  ExplanationLabel,
  ExplanationText,
} from '../../Detail.styles'
import Button from '@components/common/Button'
import TopicTags from '../TopicTags'

const QuizResult = ({ currentTopic, result, onBack }) => {
  return (
    <>
      <Header>
        <HeaderTop>
          <Button variant="secondary" onClick={onBack}>
            ← Kembali
          </Button>
        </HeaderTop>

        <TopicInfo>
          <h2>📝 {currentTopic.title}</h2>
          {currentTopic.description && <p>{currentTopic.description}</p>}
          <TopicTags tags={currentTopic?.tags} />
        </TopicInfo>
      </Header>

      <QuizContainer>
        <ResultContainer>
          <CelebrationHeader>🎉 Kuis Selesai! 🎉</CelebrationHeader>

          <ResultScore>{result.score}%</ResultScore>
          <ResultLabel>
            {result.correctQuestions} dari {result.totalQuestions} jawaban benar
          </ResultLabel>

          <StatsGrid>
            <StatCard type="correct">
              <StatIcon>✓</StatIcon>
              <StatValue type="correct">{result.correctQuestions}</StatValue>
              <StatLabel>Benar</StatLabel>
            </StatCard>
            <StatCard type="wrong">
              <StatIcon>✗</StatIcon>
              <StatValue type="wrong">{result.totalQuestions - result.correctQuestions}</StatValue>
              <StatLabel>Salah</StatLabel>
            </StatCard>
            <StatCard type="info">
              <StatIcon>📊</StatIcon>
              <StatValue type="info">{result.totalQuestions}</StatValue>
              <StatLabel>Total Soal</StatLabel>
            </StatCard>
          </StatsGrid>
        </ResultContainer>

        <Divider />

        <AnswerReview>
          <ReviewTitle>📋 Review Jawaban</ReviewTitle>
          {result.answers?.map((answer, index) => (
            <ReviewItem key={index} isCorrect={answer.is_correct}>
              <ReviewBadge>{answer.is_correct ? '✓' : '✗'}</ReviewBadge>

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
                  <ExplanationLabel isCorrect={answer.is_correct}>💡 Penjelasan</ExplanationLabel>
                  <ExplanationText>{answer.explanation}</ExplanationText>
                </ExplanationBox>
              )}
            </ReviewItem>
          ))}
        </AnswerReview>

        <Button variant="secondary" onClick={onBack}>
          🏠 Kembali ke Daftar Topik
        </Button>
      </QuizContainer>
    </>
  )
}

export default QuizResult
