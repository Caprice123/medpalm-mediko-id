import Button from '@components/common/Button'
import {
  Container,
  ResultContainer,
  Header,
  ScoreCircle,
  ScoreText,
  ScoreLabel,
  ScoreSubtext,
  ContentLayout,
  ImageSection,
  ResultsSection,
  ResultsList,
  ResultCard,
  ResultHeader,
  ResultIcon,
  ResultTitle,
  QuestionText,
  AnswerRow,
  AnswerLabel,
  AnswerValue,
  SimilarityBadge,
  ButtonGroup,
  ImagePreview,
  PreviewImage,
  ImageLabel
} from './QuizResult.styles'

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
            You got {result.correct_questions} out of {result.totalQuestions} questions correct
          </ScoreSubtext>
        </Header>

        <ContentLayout>
          {/* Left side - Image */}
          <ImageSection>
            {result.imageUrl && (
              <ImagePreview>
                <PreviewImage src={result.imageUrl} alt="Quiz image" />
                <ImageLabel>Reference Image</ImageLabel>
              </ImagePreview>
            )}
          </ImageSection>

          {/* Right side - Results */}
          <ResultsSection>
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

                  <QuestionText>{answer.question || 'Question'}</QuestionText>

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
                </ResultCard>
              ))}
            </ResultsList>
          </ResultsSection>
        </ContentLayout>

        <ButtonGroup>
          <Button onClick={onBack}>
            Kembali
          </Button>
          <Button variant="primary" onClick={handleTryAgain}>
            Coba Lagi
          </Button>
        </ButtonGroup>
      </ResultContainer>
    </Container>
  )
}

export default QuizResult
