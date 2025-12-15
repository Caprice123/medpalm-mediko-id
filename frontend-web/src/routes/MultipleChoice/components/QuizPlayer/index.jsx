import { useState, useEffect, useCallback } from 'react'
import {
  Container,
  Header,
  TopicTitle,
  ProgressBar,
  ProgressFill,
  ProgressText,
  TimerContainer,
  TimerText,
  QuestionContainer,
  QuestionNumber,
  QuestionText,
  QuestionImage,
  OptionsContainer,
  OptionCard,
  OptionLabel,
  OptionText,
  NavigationContainer,
  NavigationButtons,
  BackButton,
  PreviousButton,
  NextButton,
  SubmitButton,
  WarningText
} from './QuizPlayer.styles'

const QuizPlayer = ({ topic, onSubmit, onBack }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeRemaining, setTimeRemaining] = useState(
    topic.quiz_time_limit > 0 ? topic.quiz_time_limit * 60 : null
  )
  const [showSubmitWarning, setShowSubmitWarning] = useState(false)

  const questions = topic.mcq_questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const answeredCount = Object.keys(answers).length
  const progress = (answeredCount / totalQuestions) * 100

  // Timer countdown
  useEffect(() => {
    if (timeRemaining === null || timeRemaining <= 0) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          // Time's up - auto submit
          handleSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeRemaining])

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleSelectOption = (optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: optionIndex
    }))
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  const handleSubmit = useCallback(() => {
    // Check if all questions answered
    if (answeredCount < totalQuestions && !showSubmitWarning) {
      setShowSubmitWarning(true)
      return
    }

    // Format answers for submission
    const formattedAnswers = questions.map(q => ({
      question_id: q.id,
      user_answer: answers[q.id] !== undefined ? answers[q.id] : null,
      correct_answer: q.correct_answer,
      is_correct: answers[q.id] === q.correct_answer
    }))

    onSubmit(formattedAnswers)
  }, [answers, questions, answeredCount, totalQuestions, showSubmitWarning, onSubmit])

  if (!currentQuestion) {
    return <div>No questions available</div>
  }

  return (
    <Container>
      <Header>
        <TopicTitle>{topic.title}</TopicTitle>

        <ProgressBar>
          <ProgressFill progress={progress} />
          <ProgressText>
            {answeredCount} / {totalQuestions} Terjawab
          </ProgressText>
        </ProgressBar>

        {timeRemaining !== null && (
          <TimerContainer warning={timeRemaining < 60}>
            <TimerText>⏱️ {formatTime(timeRemaining)}</TimerText>
          </TimerContainer>
        )}
      </Header>

      <QuestionContainer>
        <QuestionNumber>
          Soal {currentQuestionIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        <QuestionText>{currentQuestion.question}</QuestionText>

        {currentQuestion.image_url && (
          <QuestionImage src={currentQuestion.image_url} alt="Question" />
        )}

        <OptionsContainer>
          {currentQuestion.options?.map((option, index) => (
            <OptionCard
              key={index}
              selected={answers[currentQuestion.id] === index}
              onClick={() => handleSelectOption(index)}
            >
              <OptionLabel>{String.fromCharCode(65 + index)}</OptionLabel>
              <OptionText>{option}</OptionText>
            </OptionCard>
          ))}
        </OptionsContainer>
      </QuestionContainer>

      {showSubmitWarning && answeredCount < totalQuestions && (
        <WarningText>
          ⚠️ Anda belum menjawab semua soal ({totalQuestions - answeredCount} soal tersisa). Yakin ingin submit?
        </WarningText>
      )}

      <NavigationContainer>
        <BackButton onClick={onBack}>
          ← Kembali
        </BackButton>

        <NavigationButtons>
          <PreviousButton
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Sebelumnya
          </PreviousButton>

          {currentQuestionIndex < totalQuestions - 1 ? (
            <NextButton onClick={handleNext}>
              Selanjutnya →
            </NextButton>
          ) : (
            <SubmitButton onClick={handleSubmit}>
              Submit Jawaban
            </SubmitButton>
          )}
        </NavigationButtons>
      </NavigationContainer>
    </Container>
  )
}

export default QuizPlayer
