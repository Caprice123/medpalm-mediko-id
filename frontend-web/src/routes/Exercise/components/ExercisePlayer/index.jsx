import { useState, useEffect, useRef, useMemo } from 'react'
import { useSelector } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import {
  Container,
  Header,
  HeaderTop,
  ProgressBadge,
  TopicInfo,
  TagList,
  Tag,
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
} from './ExercisePlayer.styles'
import Button from '@components/common/Button'

const ExercisePlayer = ({ topic, result, onSubmit, onBack }) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const inputRef = useRef(null)

  // Get tag groups from Redux
  const { tags } = useSelector(state => state.tags)

  // Get tag group IDs
  const universityGroupId = useMemo(() => {
    return tags?.find(tag => tag.name === 'university')?.id
  }, [tags])

  const semesterGroupId = useMemo(() => {
    return tags?.find(tag => tag.name === 'semester')?.id
  }, [tags])

  // Get tag groups using tagGroupId
  const universityTags = useMemo(() => {
    return topic.tags?.filter(tag => tag.tagGroupId === universityGroupId) || []
  }, [topic.tags, universityGroupId])

  const semesterTags = useMemo(() => {
    return topic.tags?.filter(tag => tag.tagGroupId === semesterGroupId) || []
  }, [topic.tags, semesterGroupId])

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

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      if (isLastQuestion) {
        // If it's the last question and all are answered, submit
        if (allAnswered) {
          handleSubmit()
        }
      } else {
        // Otherwise, move to next question
        handleNext()
      }
    }
  }

  const isLastQuestion = currentIndex === totalQuestions - 1
  const answeredCount = Object.values(answers).filter(a => a?.trim()).length
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
    const wrongAnswers = result.total_questions - result.correct_questions

    return (
      <Container>
        <Header>
          <Button variant="secondary" onClick={onBack}>
            ← Kembali
          </Button>
          <TopicInfo>
            <h2>🧠 {topic.title}</h2>
            <p>{topic.description}</p>

            {/* University Tags */}
            {universityTags.length > 0 && (
              <TagList>
                {universityTags.map((tag) => (
                  <Tag key={tag.id} university>
                    🏛️ {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}

            {/* Semester Tags */}
            {semesterTags.length > 0 && (
              <TagList>
                {semesterTags.map((tag) => (
                  <Tag key={tag.id} semester>
                    📚 {tag.name}
                  </Tag>
                ))}
              </TagList>
            )}
          </TopicInfo>
        </Header>

        <QuestionCard>
          <ResultContainer>
            <CelebrationHeader>
              🎉 Kuis Selesai! 🎉
            </CelebrationHeader>

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
              // Find the question object
              const question = topic.questions.find(q => q.id === answer.questionId)

              return (
                <ReviewItem key={index} isCorrect={answer.isCorrect}>
                  <ReviewBadge>
                    {answer.isCorrect ? '✓' : '✗'}
                  </ReviewBadge>

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

          <Button variant="secondary" onClick={onBack}>
            🏠 Kembali ke Daftar Topik
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
          <h2>🧠 {topic.title}</h2>
          <p>{topic.description}</p>

          {/* University Tags */}
          {universityTags.length > 0 && (
            <TagList>
              {universityTags.map((tag) => (
                <Tag key={tag.id} university>
                  🏛️ {tag.name}
                </Tag>
              ))}
            </TagList>
          )}

          {/* Semester Tags */}
          {semesterTags.length > 0 && (
            <TagList>
              {semesterTags.map((tag) => (
                <Tag key={tag.id} semester>
                  📚 {tag.name}
                </Tag>
              ))}
            </TagList>
          )}
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
          <Button
            variant="secondary"
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
        <SubmitSection>
          <SubmitStatus incomplete={!allAnswered}>
            {allAnswered ? '✨' : '⚡'} Kamu sudah menjawab {answeredCount} dari {totalQuestions} soal
          </SubmitStatus>
          <Button
            onClick={handleSubmit}
            disabled={!allAnswered}
          >
            🎯 Selesai & Lihat Hasil
          </Button>
        </SubmitSection>
      )}
    </Container>
  )
}

export default ExercisePlayer
