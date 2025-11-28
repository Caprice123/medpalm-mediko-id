import { useState } from 'react'
import {
  Container,
  Header,
  TopicInfo,
  BackButton,
  QuestionCard,
  QuestionNumber,
  QuestionText,
  AnswerInput,
  NavigationButtons,
  NavButton,
  SubmitButton,
  ProgressBar,
  ProgressFill
} from './ExercisePlayer.styles'

const ExercisePlayer = ({ topic, onSubmit, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})

  const currentQuestion = topic.questions[currentIndex]
  const totalQuestions = topic.questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1)
    }
  }

  const handleSubmit = () => {
    // Convert answers object to array format for API
    const answersArray = topic.questions.map(question => ({
      questionId: question.id,
      userAnswer: answers[question.id] || ''
    }))

    onSubmit(answersArray)
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const allAnswered = topic.questions.every(q => answers[q.id]?.trim())

  return (
    <Container>
      <Header>
        <TopicInfo>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
        </TopicInfo>
        <BackButton onClick={onBack}>
          ← Kembali
        </BackButton>
      </Header>

      <QuestionCard>
        <QuestionNumber>
          Soal {currentIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        <QuestionText>
          {currentQuestion.question}
        </QuestionText>

        <AnswerInput
          placeholder="Tulis jawaban Anda di sini..."
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
        />

        <NavigationButtons>
          <NavButton
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Sebelumnya
          </NavButton>
          <NavButton
            variant="primary"
            onClick={handleNext}
            disabled={isLastQuestion}
          >
            Selanjutnya →
          </NavButton>
        </NavigationButtons>

        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>
      </QuestionCard>

      {isLastQuestion && (
        <SubmitButton
          onClick={handleSubmit}
          disabled={!allAnswered}
        >
          Selesai & Lihat Hasil
        </SubmitButton>
      )}
    </Container>
  )
}

export default ExercisePlayer
