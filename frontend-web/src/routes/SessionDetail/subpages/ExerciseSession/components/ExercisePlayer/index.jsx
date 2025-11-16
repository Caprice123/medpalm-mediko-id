import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { completeSession } from '@store/session/action'
import { BackLink, BlankInput, Button, Container, ContentWrapper, HeaderNav, LoadingSpinner, NavigationButtons, Progress, ProgressBar, QuestionCard, QuestionDot, QuestionIndicators, QuestionNumber, QuestionStats, QuestionText, TopicTitle } from './ExercisePlayer.styles'

function ExercisePlayer({ attemptId, onComplete }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { attemptDetail } = useSelector(state => state.session)
  const { isCompletingSession } = useSelector(state => state.session.loading)

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState({}) // Store all answers: { questionId: { answers: ['', '', ...], timeTaken: 0 } }
  const [questionStartTimes, setQuestionStartTimes] = useState({})

  const questions = attemptDetail?.questions || []
  const currentQuestion = questions[currentQuestionIndex]
  const totalQuestions = questions.length
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100

  // Count questions that have at least one blank filled
  const answeredCount = Object.keys(userAnswers).filter(qId => {
    const answer = userAnswers[qId]
    return answer?.answers && answer.answers.some(a => a && a.trim() !== '')
  }).length

  useEffect(() => {
    // Track time for current question
    if (currentQuestion && !questionStartTimes[currentQuestion.id]) {
      setQuestionStartTimes(prev => ({
        ...prev,
        [currentQuestion.id]: Date.now()
      }))
    }
  }, [currentQuestion, questionStartTimes])

  const handleAnswerChange = (blankIndex, value) => {
    if (!currentQuestion) return

    const timeTaken = questionStartTimes[currentQuestion.id]
      ? Math.floor((Date.now() - questionStartTimes[currentQuestion.id]) / 1000)
      : 0

    setUserAnswers(prev => {
      const currentAnswers = prev[currentQuestion.id]?.answers || []
      const newAnswers = [...currentAnswers]
      newAnswers[blankIndex] = value

      return {
        ...prev,
        [currentQuestion.id]: {
          answers: newAnswers,
          timeTaken
        }
      }
    })
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleJumpToQuestion = (index) => {
    setCurrentQuestionIndex(index)
  }

  const handleSubmitAll = async () => {
    if (answeredCount === 0) {
      alert('Silakan jawab setidaknya satu pertanyaan sebelum submit')
      return
    }

    const unansweredCount = totalQuestions - answeredCount
    if (unansweredCount > 0) {
      const confirm = window.confirm(
        `Anda belum menjawab ${unansweredCount} soal. Apakah Anda yakin ingin submit sekarang?`
      )
      if (!confirm) return
    }

    try {
      // Format answers for backend - join multiple blanks with semicolon
      const formattedAnswers = Object.entries(userAnswers).map(([questionId, data]) => ({
        questionId: parseInt(questionId),
        userAnswer: Array.isArray(data.answers) ? data.answers.join(';') : (data.answer || ''),
        timeTakenSeconds: data.timeTaken
      }))

      await dispatch(completeSession(attemptId, formattedAnswers))

      // Call onComplete callback to refresh attempts and show results
      if (onComplete) {
        await onComplete(attemptId)
      }
    } catch (error) {
      alert('Gagal submit jawaban: ' + (error.message || 'Terjadi kesalahan'))
    }
  }

  const renderQuestionText = (questionText) => {
    const parts = questionText.split('____')
    const currentAnswers = userAnswers[currentQuestion?.id]?.answers || []

    return (
      <>
        {parts.map((part, index) => (
          <span key={index}>
            {part}
            {index < parts.length - 1 && (
              <BlankInput
                type="text"
                placeholder="____"
                value={currentAnswers[index] || ''}
                onChange={(e) => handleAnswerChange(index, e.target.value)}
                autoFocus={index === 0}
              />
            )}
          </span>
        ))}
      </>
    )
  }

  if (!attemptDetail || !questions.length || !currentQuestion) {
    return <Container>Loading...</Container>
  }

  const isLastQuestion = currentQuestionIndex === totalQuestions - 1

  return (
    <Container>
      {/* <HeaderNav>
        <BackLink onClick={() => navigate('/dashboard')}>
          ← Kembali ke Dashboard
        </BackLink>
        <TopicTitle>{topicSnapshot.title}</TopicTitle>
        <div></div>
      </HeaderNav> */}

      <ContentWrapper>
        <ProgressBar>
          <Progress percentage={progress} />
        </ProgressBar>

        <QuestionIndicators>
        {questions.map((q, index) => {
          const hasAnswer = userAnswers[q.id]?.answers?.some(a => a && a.trim() !== '')
          return (
            <QuestionDot
              key={q.id}
              current={index === currentQuestionIndex}
              answered={hasAnswer}
              onClick={() => handleJumpToQuestion(index)}
            >
              {index + 1}
            </QuestionDot>
          )
        })}
      </QuestionIndicators>

      <QuestionCard>
        <QuestionNumber>
          Soal {currentQuestionIndex + 1} dari {totalQuestions}
        </QuestionNumber>

        <QuestionText>
          {renderQuestionText(currentQuestion.question_text)}
        </QuestionText>

        <NavigationButtons>
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            ← Sebelumnya
          </Button>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {!isLastQuestion ? (
              <Button
                variant="secondary"
                onClick={handleNext}
              >
                Selanjutnya →
              </Button>
            ) : null}

            <Button
              variant="primary"
              onClick={handleSubmitAll}
              disabled={isCompletingSession}
            >
              {isCompletingSession && <LoadingSpinner />}
              Submit Semua Jawaban
            </Button>
          </div>
        </NavigationButtons>
      </QuestionCard>

        <QuestionStats>
          {answeredCount} dari {totalQuestions} soal telah dijawab
        </QuestionStats>
      </ContentWrapper>
    </Container>
  )
}

export default ExercisePlayer
