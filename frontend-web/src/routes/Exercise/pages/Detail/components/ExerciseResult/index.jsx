import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Header,
  TopicInfo,
  QuestionCard,
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
} from '../ExercisePlayer/ExercisePlayer.styles'
import Button from '@components/common/Button'
import TopicTags from '../TopicTags'

const renderQuestionForReview = (questionText, answer) => {
  const parts = questionText.split('____')
  return (
    <>
      {parts.map((part, idx) => (
        <span key={idx}>
          {part}
          {idx < parts.length - 1 && <span className="blank">{answer}</span>}
        </span>
      ))}
    </>
  )
}

const ExerciseResult = ({ topic, result, onBack }) => {
  const wrongAnswers = result.total_questions - result.correct_questions

  return (
    <Container>
      <Header>
        <Button variant="secondary" onClick={onBack}>
          ← Kembali
        </Button>
        <TopicInfo>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
          <TopicTags tags={topic.tags} />
        </TopicInfo>
      </Header>

      <QuestionCard>
        <ResultContainer>
          <CelebrationHeader>🎉 Kuis Selesai! 🎉</CelebrationHeader>
          <ResultScore>{result.score}%</ResultScore>
          <ResultLabel>
            {result.correct_questions} dari {result.total_questions} jawaban benar
          </ResultLabel>

          <StatsGrid>
            <StatCard type="correct">
              <StatIcon>✓</StatIcon>
              <StatValue type="correct">{result.correct_questions}</StatValue>
              <StatLabel>Benar</StatLabel>
            </StatCard>
            <StatCard type="wrong">
              <StatIcon>✗</StatIcon>
              <StatValue type="wrong">{wrongAnswers}</StatValue>
              <StatLabel>Salah</StatLabel>
            </StatCard>
            <StatCard type="info">
              <StatIcon>📊</StatIcon>
              <StatValue type="info">{result.total_questions}</StatValue>
              <StatLabel>Total Soal</StatLabel>
            </StatCard>
          </StatsGrid>
        </ResultContainer>

        <Divider />

        <AnswerReview>
          <ReviewTitle>📋 Review Jawaban</ReviewTitle>
          {result.answers?.map((answer, index) => {
            const question = topic.questions.find(q => q.id === answer.questionId)
            return (
              <ReviewItem key={index} isCorrect={answer.isCorrect}>
                <ReviewBadge>{answer.isCorrect ? '✓' : '✗'}</ReviewBadge>

                <ReviewQuestion>
                  {index + 1}. {renderQuestionForReview(question?.question || '', answer.correctAnswer)}
                </ReviewQuestion>

                {question?.image && (
                  <PhotoProvider>
                    <PhotoView src={question.image.url}>
                      <div style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                        <img
                          src={question.image.url}
                          alt="Question"
                          style={{
                            maxWidth: '100%',
                            maxHeight: '300px',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
                          }}
                        />
                      </div>
                    </PhotoView>
                  </PhotoProvider>
                )}

                <ReviewAnswer>
                  <strong>{answer.isCorrect ? '💚 Jawaban:' : '❌ Jawaban Anda:'}</strong>
                  <span>
                    {answer.userAnswer || 'Tidak dijawab'}
                    {answer.isCorrect && <span className="icon">✓</span>}
                  </span>
                </ReviewAnswer>

                {!answer.isCorrect && (
                  <ReviewAnswer>
                    <strong>✓ Jawaban Benar:</strong>
                    <span>{answer.correctAnswer}</span>
                  </ReviewAnswer>
                )}

                {answer.explanation && (
                  <ExplanationBox isCorrect={answer.isCorrect}>
                    <ExplanationLabel isCorrect={answer.isCorrect}>💡 Penjelasan</ExplanationLabel>
                    <ExplanationText>{answer.explanation}</ExplanationText>
                  </ExplanationBox>
                )}
              </ReviewItem>
            )
          })}
        </AnswerReview>

        <Button variant="secondary" onClick={onBack}>
          Kembali ke Daftar Topik
        </Button>
      </QuestionCard>
    </Container>
  )
}

export default ExerciseResult
