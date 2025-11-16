import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  HeaderNav,
  BackLink,
  HeaderTitle,
  ContentWrapper,
  ResultCard,
  ScoreCircle,
  ScoreNumber,
  ScoreLabel,
  ResultTitle,
  ResultSubtitle,
  StatsGrid,
  StatCard,
  StatValue,
  StatLabel,
  ButtonGroup,
  Button,
  AnswersSection,
  SectionTitle,
  AnswerItem,
  AnswerHeader,
  AnswerNumber,
  AnswerStatus,
  AnswerQuestion,
  AnswerDetails
} from './SessionResults.styles'

function SessionResults({ attemptMetadata, attemptDetail, onViewHistory, onTryAgain }) {
  const navigate = useNavigate()

  // Use attemptMetadata and attemptDetail from props
  const questions = attemptDetail?.questions || []
  const answers = attemptDetail?.answers || []

  const totalQuestions = attemptMetadata?.totalQuestion || 0
  const correctAnswers = attemptMetadata?.correctQuestion || 0
  const percentage = attemptMetadata?.score || 0
  const creditsUsed = attemptMetadata?.credits_used || 0

  const getResultMessage = () => {
    if (percentage >= 80) return 'Luar Biasa!'
    if (percentage >= 60) return 'Bagus!'
    if (percentage >= 40) return 'Cukup Baik'
    return 'Tetap Semangat!'
  }

  return (
    <Container>
      <HeaderNav>
        <BackLink onClick={() => navigate('/dashboard')}>
          ← Kembali ke Dashboard
        </BackLink>
        <HeaderTitle>Hasil Latihan</HeaderTitle>
        <div></div>
      </HeaderNav>

      <ContentWrapper>
      <ResultCard>
        <ScoreCircle percentage={percentage}>
          <ScoreNumber>{percentage}%</ScoreNumber>
          <ScoreLabel>Skor Anda</ScoreLabel>
        </ScoreCircle>

        <ResultTitle>{getResultMessage()}</ResultTitle>
        <ResultSubtitle>
          Anda telah menyelesaikan latihan soal
        </ResultSubtitle>

        <StatsGrid>
          <StatCard>
            <StatValue>{correctAnswers}</StatValue>
            <StatLabel>Benar</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalQuestions - correctAnswers}</StatValue>
            <StatLabel>Salah</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue>{totalQuestions}</StatValue>
            <StatLabel>Total Soal</StatLabel>
          </StatCard>
        </StatsGrid>

        <ButtonGroup>
          <Button onClick={onTryAgain}>
            🔄 Coba Lagi
          </Button>
          <Button variant="primary" onClick={onViewHistory}>
            📊 Lihat Riwayat
          </Button>
        </ButtonGroup>
      </ResultCard>

      <AnswersSection>
        <SectionTitle>Review Jawaban Anda</SectionTitle>

        {questions.map((question, index) => {
          // Find answer by exercise_session_question_id
          const answer = answers.find(a => a.exercise_session_question_id === question.id)
          const isCorrect = answer?.is_correct

          return (
            <AnswerItem key={question.id} isCorrect={isCorrect}>
              <AnswerHeader>
                <AnswerNumber>Soal {index + 1}</AnswerNumber>
                <AnswerStatus isCorrect={isCorrect}>
                  {isCorrect ? '✓ Benar' : '✗ Salah'}
                </AnswerStatus>
              </AnswerHeader>

              <AnswerQuestion>{question.question_text}</AnswerQuestion>

              <AnswerDetails>
                <div>
                  <strong>Jawaban Anda:</strong> {answer?.user_answer || '-'}
                </div>
                {!isCorrect && (
                  <div style={{ marginTop: '0.5rem' }}>
                    <strong>Jawaban Benar:</strong> {question.answer_text}
                  </div>
                )}
                {question.explanation && (
                  <div style={{ marginTop: '0.5rem', fontStyle: 'italic' }}>
                    <strong>Penjelasan:</strong> {question.explanation}
                  </div>
                )}
              </AnswerDetails>
            </AnswerItem>
          )
        })}
      </AnswersSection>
      </ContentWrapper>
    </Container>
  )
}

export default SessionResults
