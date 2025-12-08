import styled from 'styled-components'

const Container = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  padding: 2rem;
`

const ResultContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e2e8f0;
`

const ScoreCircle = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props =>
    props.score >= 80
      ? 'linear-gradient(135deg, #10b981, #059669)'
      : props.score >= 60
      ? 'linear-gradient(135deg, #f59e0b, #d97706)'
      : 'linear-gradient(135deg, #ef4444, #dc2626)'};
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
`

const ScoreText = styled.div`
  color: white;
  font-size: 3rem;
  font-weight: 800;
`

const ScoreLabel = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
`

const ScoreSubtext = styled.p`
  color: #64748b;
  font-size: 1.1rem;
`

const ResultsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`

const ResultCard = styled.div`
  padding: 1.5rem;
  background: ${props => (props.isCorrect ? '#ecfdf5' : '#fef2f2')};
  border-left: 4px solid ${props => (props.isCorrect ? '#10b981' : '#ef4444')};
  border-radius: 8px;
`

const ResultHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`

const ResultIcon = styled.div`
  font-size: 1.5rem;
`

const ResultTitle = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 0.875rem;
`

const QuestionText = styled.p`
  color: #475569;
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1rem;
`

const AnswerRow = styled.div`
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
`

const AnswerLabel = styled.div`
  font-weight: 600;
  color: #64748b;
  min-width: 120px;
`

const AnswerValue = styled.div`
  color: ${props => (props.isCorrect ? '#059669' : '#dc2626')};
  font-weight: ${props => (props.isCorrect ? 600 : 400)};
`

const Explanation = styled.div`
  margin-top: 1rem;
  padding: 1rem;
  background: white;
  border-radius: 6px;
  color: #475569;
  font-size: 0.875rem;
  line-height: 1.6;
  border: 1px solid #e2e8f0;
`

const SimilarityBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #ede9fe;
  color: #7c3aed;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  margin-left: 0.5rem;
`

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 2px solid #e2e8f0;
`

const Button = styled.button`
  padding: 1rem 2rem;
  border-radius: 12px;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;

  ${props => {
    if (props.variant === 'primary') {
      return `
        background: linear-gradient(135deg, #6BB9E8, #8DC63F);
        color: white;
        box-shadow: 0 4px 12px rgba(107, 185, 232, 0.3);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(107, 185, 232, 0.4);
        }
      `
    } else {
      return `
        background: #f1f5f9;
        color: #475569;

        &:hover {
          background: #e2e8f0;
        }
      `
    }
  }}
`

const ImagePreview = styled.div`
  margin-bottom: 2rem;
  text-align: center;
`

const PreviewImage = styled.img`
  max-width: 100%;
  max-height: 300px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
`

function QuizResult({ result, onBack }) {
  const handleTryAgain = () => {
    window.location.reload()
  }

  return (
    <Container>
      <ResultContainer>
        <Header>
          <ScoreCircle score={result.score}>
            <ScoreText>{result.score}%</ScoreText>
          </ScoreCircle>
          <ScoreLabel>
            {result.score >= 80
              ? 'Excellent Work! 🎉'
              : result.score >= 60
              ? 'Good Job! 👍'
              : 'Keep Practicing! 💪'}
          </ScoreLabel>
          <ScoreSubtext>
            You got {result.correct_questions} out of {result.total_questions} questions correct
          </ScoreSubtext>
        </Header>

        {result.image_url && (
          <ImagePreview>
            <PreviewImage src={result.image_url} alt="Quiz image" />
          </ImagePreview>
        )}

        <ResultsList>
          {result.answers?.map((answer, index) => (
            <ResultCard key={index} isCorrect={answer.isCorrect}>
              <ResultHeader>
                <ResultIcon>{answer.isCorrect ? '✅' : '❌'}</ResultIcon>
                <ResultTitle>
                  Question {index + 1}
                  {answer.similarityScore !== undefined && (
                    <SimilarityBadge>
                      {Math.round(answer.similarityScore * 100)}% match
                    </SimilarityBadge>
                  )}
                </ResultTitle>
              </ResultHeader>

              <QuestionText>{answer.label || 'Question'}</QuestionText>

              <AnswerRow>
                <AnswerLabel>Your answer:</AnswerLabel>
                <AnswerValue isCorrect={answer.isCorrect}>
                  {answer.userAnswer}
                </AnswerValue>
              </AnswerRow>

              {!answer.isCorrect && (
                <AnswerRow>
                  <AnswerLabel>Correct answer:</AnswerLabel>
                  <AnswerValue isCorrect={true}>
                    {answer.correctAnswer}
                  </AnswerValue>
                </AnswerRow>
              )}

              {answer.explanation && (
                <Explanation>
                  <strong>Explanation:</strong> {answer.explanation}
                </Explanation>
              )}
            </ResultCard>
          ))}
        </ResultsList>

        <ButtonGroup>
          <Button onClick={onBack}>
            Back to Quizzes
          </Button>
          <Button variant="primary" onClick={handleTryAgain}>
            Try Again
          </Button>
        </ButtonGroup>
      </ResultContainer>
    </Container>
  )
}

export default QuizResult
