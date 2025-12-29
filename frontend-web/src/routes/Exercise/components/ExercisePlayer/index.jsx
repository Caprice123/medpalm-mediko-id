import { useState, useEffect, useRef } from 'react'
import Button from '@components/common/Button'
import {
  Container,
  Header,
  TopicInfo,
  BackButton,
  QuestionCard,
  QuestionNumber,
  QuestionText,
  InlineInput,
  NavigationButtons,
  ProgressBar,
  ProgressFill,
  ResultContainer,
  ResultScore,
  ResultLabel,
  ResultStatus,
  AnswerReview,
  ReviewTitle,
  ReviewItem,
  ReviewQuestion,
  ReviewAnswer,
  ExplanationBox,
  ExplanationLabel,
  ExplanationText
} from './ExercisePlayer.styles'

const ExercisePlayer = ({ topic, result, onSubmit, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const inputRef = useRef(null)

  // Auto-focus input when question changes
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentIndex])

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

  // Render question text with answer highlighted for review
  const renderQuestionForReview = (questionText, answer) => {
    const parts = questionText.split('____')
    return (
      <>
        {parts.map((part, idx) => (
          <span key={idx}>
            {part}
            {idx < parts.length - 1 && (
              <span className="blank">{answer}</span>
            )}
          </span>
        ))}
      </>
    )
  }

  // Show result view if result exists
  if (result) {
    return (
      <Container>
        <Header>
          <BackButton onClick={onBack}>
            ← Kembali
          </BackButton>
          <TopicInfo>
            <h2>{topic.title}</h2>
          </TopicInfo>
        </Header>

        <QuestionCard>
          <ResultContainer>
            <ResultScore>{result.score}%</ResultScore>
            <ResultLabel>
              {result.correct_questions} dari {result.total_questions} jawaban benar
            </ResultLabel>
          </ResultContainer>

          <AnswerReview>
            <ReviewTitle>Review Jawaban</ReviewTitle>
            {result.answers?.map((answer, index) => {
              // Find the question object
              const question = topic.questions.find(q => q.id === answer.questionId)

              return (
                <ReviewItem key={index} isCorrect={answer.isCorrect}>
                  <ReviewQuestion>
                    {index + 1}. {renderQuestionForReview(question?.question || '', answer.correctAnswer)}
                  </ReviewQuestion>
                  <ReviewAnswer>
                    <strong>Jawaban Anda:</strong>
                    <span>
                      {answer.userAnswer || 'Tidak dijawab'}
                      {answer.isCorrect ? ' ✓' : ' ✗'}
                    </span>
                  </ReviewAnswer>
                  {!answer.isCorrect && (
                    <ReviewAnswer>
                      <strong>Jawaban Benar:</strong>
                      <span>{answer.correctAnswer}</span>
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
              )
            })}
          </AnswerReview>

          <Button
            variant="primary"
            onClick={onBack}
            style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}
          >
            Kembali ke Daftar Topik
          </Button>
        </QuestionCard>
      </Container>
    )
  }

  // Replace ____ with inline input in question text
  const renderQuestionWithInput = () => {
    const questionParts = currentQuestion.question.split('____')

    if (questionParts.length === 1) {
      // No blank, just return the question
      return <QuestionText>{currentQuestion.question}</QuestionText>
    }

    return (
      <QuestionText>
        {questionParts[0]}
        <InlineInput
          ref={inputRef}
          type="text"
          value={answers[currentQuestion.id] || ''}
          onChange={(e) => handleAnswerChange(e.target.value)}
        />
        {questionParts[1]}
      </QuestionText>
    )
  }

  return (
    <Container>
      <Header>
        <BackButton onClick={onBack}>
          ← Kembali
        </BackButton>
        <TopicInfo>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
        </TopicInfo>
      </Header>

      <QuestionCard>
        <ProgressBar>
          <ProgressFill progress={progress} />
        </ProgressBar>

        <QuestionNumber>
          Soal {currentIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        {renderQuestionWithInput()}

        <NavigationButtons>
          <Button
            variant="ghost"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            ← Sebelumnya
          </Button>
          <Button
            variant="primary"
            onClick={handleNext}
            disabled={isLastQuestion}
          >
            Selanjutnya →
          </Button>
        </NavigationButtons>
      </QuestionCard>

      {isLastQuestion && (
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!allAnswered}
          style={{ width: '100%', padding: '1rem', fontSize: '1.125rem' }}
        >
          Selesai & Lihat Hasil
        </Button>
      )}
    </Container>
  )
}

export default ExercisePlayer
