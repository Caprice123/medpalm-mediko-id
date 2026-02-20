import { useState, useEffect, useRef } from 'react'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Header,
  HeaderTop,
  ProgressBadge,
  TopicInfo,
  ProgressBarContainer,
  ProgressBarWrapper,
  ProgressBar,
  ProgressFill,
  ProgressPercentage,
  QuestionCard,
  QuestionText,
  InlineInput,
  HintBox,
  NavigationButtons,
  SubmitSection,
  SubmitStatus,
} from './ExercisePlayer.styles'
import Button from '@components/common/Button'
import TopicTags from '../TopicTags'

const ExercisePlayer = ({ topic, onSubmit, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const inputRef = useRef(null)

  const currentQuestion = topic.questions[currentIndex]
  const totalQuestions = topic.questions.length
  const progress = ((currentIndex + 1) / totalQuestions) * 100
  const isLastQuestion = currentIndex === totalQuestions - 1
  const answeredCount = Object.values(answers).filter(a => a?.trim()).length
  const allAnswered = topic.questions.every(q => answers[q.id]?.trim())

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentIndex])

  const handleAnswerChange = (value) => {
    setAnswers(prev => ({ ...prev, [currentQuestion.id]: value }))
  }

  const handleNext = () => {
    if (currentIndex < totalQuestions - 1) setCurrentIndex(prev => prev + 1)
  }

  const handlePrevious = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1)
  }

  const handleSubmit = () => {
    const answersArray = topic.questions.map(question => ({
      questionId: question.id,
      userAnswer: answers[question.id] || ''
    }))
    onSubmit(answersArray)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isLastQuestion) {
        if (allAnswered) handleSubmit()
      } else {
        handleNext()
      }
    }
  }

  const renderQuestionWithInput = () => {
    const questionParts = currentQuestion.question.split('____')

    if (questionParts.length === 1) {
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
          onKeyPress={handleKeyPress}
          placeholder="ketik jawaban..."
        />
        {questionParts[1]}
      </QuestionText>
    )
  }

  return (
    <Container>
      <Header>
        <HeaderTop>
          <Button variant="secondary" onClick={onBack}>
            ← Kembali
          </Button>
          <ProgressBadge>
            Progress: {currentIndex + 1}/{totalQuestions}
          </ProgressBadge>
        </HeaderTop>

        <TopicInfo>
          <h2>{topic.title}</h2>
          <p>{topic.description}</p>
          <TopicTags tags={topic.tags} />
        </TopicInfo>

        <ProgressBarContainer>
          <ProgressBarWrapper>
            <ProgressBar>
              <ProgressFill progress={progress} />
            </ProgressBar>
            <ProgressPercentage>{Math.round(progress)}%</ProgressPercentage>
          </ProgressBarWrapper>
        </ProgressBarContainer>
      </Header>

      <QuestionCard>
        {renderQuestionWithInput()}

        {currentQuestion.image && (
          <PhotoProvider>
            <PhotoView src={currentQuestion.image.url}>
              <div style={{ marginTop: '1.5rem', marginBottom: '1rem' }}>
                <img
                  src={currentQuestion.image.url}
                  alt="Question"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    cursor: 'pointer',
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }}
                />
              </div>
            </PhotoView>
          </PhotoProvider>
        )}

        <HintBox>
          <span>💡</span>
          <span>Tip: Jawab dengan istilah medis yang tepat</span>
        </HintBox>

        <NavigationButtons>
          <Button variant="secondary" onClick={handlePrevious} disabled={currentIndex === 0}>
            ← Sebelumnya
          </Button>
          <Button variant="primary" onClick={handleNext} disabled={isLastQuestion}>
            Selanjutnya →
          </Button>
        </NavigationButtons>
      </QuestionCard>

      {isLastQuestion && (
        <SubmitSection>
          <SubmitStatus incomplete={!allAnswered}>
            {allAnswered ? '✨' : '⚡'} Kamu sudah menjawab {answeredCount} dari {totalQuestions} soal
          </SubmitStatus>
          <Button onClick={handleSubmit} disabled={!allAnswered}>
            Selesai & Lihat Hasil
          </Button>
        </SubmitSection>
      )}
    </Container>
  )
}

export default ExercisePlayer
