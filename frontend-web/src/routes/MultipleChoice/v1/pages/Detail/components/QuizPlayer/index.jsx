import {
  Header,
  HeaderTop,
  TopicInfo,
  QuizContainer,
  QuizInfo,
  InfoItem,
  Timer,
  QuestionCard,
  QuestionText,
  OptionsContainer,
  OptionButton,
  OptionLabel,
  OptionText,
  OptionIcon,
  ExplanationBox,
  ExplanationLabel,
  ExplanationText,
  ActionButtons,
} from '../../Detail.styles'
import Button from '@components/common/Button'
import TopicTags from '../TopicTags'
import { useQuizPlayer } from './useQuizPlayer'

const QuizPlayer = ({ currentTopic, mode, id, onComplete, onBack }) => {
  const {
    currentQuestion,
    currentQuestionIndex,
    totalQuestions,
    answers,
    showExplanation,
    timer,
    timerActive,
    loading,
    formatTimer,
    handleAnswerSelect,
    handleNextQuestion,
    handlePreviousQuestion,
    handleNextQuestionQuiz,
    handleQuizSubmit
  } = useQuizPlayer({ currentTopic, mode, id, onComplete })

  const selectedAnswer = answers[currentQuestion?.id]
  const isCorrect = selectedAnswer === currentQuestion?.correct_answer
  const allQuestionsAnswered = currentTopic?.mcq_questions?.every(q => answers[q.id] !== undefined)

  return (
    <>
      <Header>
        <HeaderTop>
          <Button variant="secondary" onClick={onBack}>
            ← Kembali
          </Button>
        </HeaderTop>

        <TopicInfo>
          <h2>📝 {currentTopic.title}</h2>
          {currentTopic.description && <p>{currentTopic.description}</p>}
          <TopicTags tags={currentTopic?.tags} />
        </TopicInfo>
      </Header>

      <QuizContainer>
        <QuizInfo>
          <InfoItem>
            {mode === 'learning' ? '📖 Learning Mode' : '⏱️ Quiz Mode'}
          </InfoItem>
          {mode === 'quiz' && timerActive && currentTopic.quizTimeLimit > 0 && (
            <Timer warning={timer < 60}>
              ⏰ {formatTimer(timer)}
            </Timer>
          )}
          <InfoItem>
            📊 Pertanyaan {currentQuestionIndex + 1} dari {totalQuestions}
          </InfoItem>
        </QuizInfo>

        {currentQuestion && (
          <QuestionCard>
            <QuestionText>
              {currentQuestionIndex + 1}. {currentQuestion.question}
            </QuestionText>

            <OptionsContainer>
              {currentQuestion.options?.map((option, index) => {
                const isSelected = selectedAnswer === index
                const isThisCorrect = index === currentQuestion.correct_answer
                const showResult = mode === 'learning' && showExplanation

                return (
                  <OptionButton
                    key={index}
                    selected={isSelected}
                    isCorrect={isThisCorrect}
                    showResult={showResult}
                    disabled={mode === 'learning' && showExplanation}
                    onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  >
                    <OptionLabel selected={isSelected} isCorrect={isThisCorrect} showResult={showResult}>
                      {String.fromCharCode(65 + index)}
                    </OptionLabel>
                    <OptionText>{option}</OptionText>
                    {showResult && isThisCorrect && <OptionIcon>✓</OptionIcon>}
                    {showResult && isSelected && !isThisCorrect && <OptionIcon>✗</OptionIcon>}
                  </OptionButton>
                )
              })}
            </OptionsContainer>

            {mode === 'learning' && showExplanation && currentQuestion.explanation && (
              <ExplanationBox isCorrect={isCorrect}>
                <ExplanationLabel isCorrect={isCorrect}>
                  {isCorrect ? '✅ Benar!' : '❌ Kurang Tepat'}
                </ExplanationLabel>
                <ExplanationText>{currentQuestion.explanation}</ExplanationText>
              </ExplanationBox>
            )}
          </QuestionCard>
        )}

        <ActionButtons>
          {mode === 'learning' ? (
            showExplanation ? (
              <Button variant="primary" onClick={handleNextQuestion} style={{ width: '100%', padding: '1rem' }}>
                {currentQuestionIndex < totalQuestions - 1 ? 'Soal Selanjutnya →' : 'Selesai'}
              </Button>
            ) : (
              <Button variant="outline" disabled style={{ width: '100%', padding: '1rem', opacity: 0.5 }}>
                Pilih jawaban untuk melanjutkan
              </Button>
            )
          ) : (
            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
              {currentQuestionIndex > 0 && (
                <Button variant="outline" onClick={handlePreviousQuestion} style={{ flex: 1, padding: '1rem' }}>
                  ← Soal Sebelumnya
                </Button>
              )}
              {currentQuestionIndex < totalQuestions - 1 ? (
                <Button variant="primary" onClick={handleNextQuestionQuiz} style={{ flex: 1, padding: '1rem' }}>
                  Soal Selanjutnya →
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleQuizSubmit}
                  disabled={!allQuestionsAnswered || loading.isSubmitAnatomyQuizLoading}
                  style={{ flex: 1, padding: '1rem' }}
                >
                  {loading.isSubmitAnatomyQuizLoading ? 'Mengirim...' : 'Kirim Jawaban'}
                </Button>
              )}
            </div>
          )}
        </ActionButtons>
      </QuizContainer>
    </>
  )
}

export default QuizPlayer
