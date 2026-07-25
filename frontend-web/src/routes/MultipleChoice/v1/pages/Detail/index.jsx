import { Container, Content, LoadingSpinner } from './Detail.styles'
import { useMultipleChoiceDetail } from './useMultipleChoiceDetail'
import QuizPlayer from './components/QuizPlayer'
import QuizResult from './components/QuizResult'

const Detail = () => {
  const {
    id,
    currentTopic,
    mode,
    quizResult,
    setQuizResult,
    handleBack
  } = useMultipleChoiceDetail()

  if (!currentTopic) {
    return (
      <Container>
        <Content>
          <div style={{ textAlign: 'center', padding: '4rem 0' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem', color: '#64748b' }}>Memuat topik...</p>
          </div>
        </Content>
      </Container>
    )
  }

  return (
    <Container>
      <Content>
        {quizResult ? (
          <QuizResult currentTopic={currentTopic} result={quizResult} onBack={handleBack} />
        ) : (
          <QuizPlayer currentTopic={currentTopic} mode={mode} id={id} onComplete={setQuizResult} onBack={handleBack} />
        )}
      </Content>
    </Container>
  )
}

export default Detail
