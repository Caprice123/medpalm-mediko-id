import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import {
  PlayerContainer,
  ProgressBar,
  ProgressText,
  ProgressBarBg,
  ProgressBarFill,
  CardContainer,
  Flashcard,
  CardFront,
  CardBack,
  CardLabel,
  CardContent,
  CardImage,
  AnswerSection,
  AnswerLabel,
  AnswerInput,
  ShowAnswerSection,
  ShowAnswerButton,
  NavigationButtons,
  PrimaryButton,
  SecondaryButton,
  CardDots,
  Dot,
  BackButton,
  FeedbackSection,
  FeedbackBadge,
  FeedbackText,
  AnswerComparison,
  ComparisonRow,
  ComparisonLabel,
  ComparisonValue
} from './FlashcardPlayer.styles'

const FlashcardPlayer = ({ onSubmit, onBack }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [startTime, setStartTime] = useState(Date.now())

  const { topicSnapshot } = useSelector(state => state.session)

  // Cards are already sorted by spaced repetition from backend
  const cards = topicSnapshot?.cards || []

  const currentCard = cards[currentCardIndex]
  const isLastCard = currentCardIndex === cards.length - 1

  useEffect(() => {
    // Reset when moving to next card
    setIsFlipped(false)
    setShowFeedback(false)
    setCurrentFeedback(null)
    setCurrentAnswer('')
    setStartTime(Date.now())
  }, [currentCardIndex])

  // Calculate similarity (same logic as backend for instant feedback)
  const calculateSimilarity = (str1, str2) => {
    const normalize = (s) => (s || '').toLowerCase().trim().replace(/\s+/g, ' ')
    const a = normalize(str1)
    const b = normalize(str2)

    if (a === b) return 1.0
    if (a.length === 0 || b.length === 0) return 0.0

    // Levenshtein distance
    const matrix = []
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i]
    }
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    const distance = matrix[b.length][a.length]
    const maxLength = Math.max(a.length, b.length)
    return 1 - (distance / maxLength)
  }

  const handleSubmitAnswer = () => {
    const correctAnswer = currentCard.back || currentCard.back_text
    const similarity = calculateSimilarity(currentAnswer, correctAnswer)

    setCurrentFeedback({
      similarity,
      userAnswer: currentAnswer,
      correctAnswer
    })

    setIsFlipped(true)
    setShowFeedback(true)

    const timeTaken = Math.floor((Date.now() - startTime) / 1000)
    const newAnswer = {
      cardId: currentCard.id,
      userAnswer: currentAnswer,
      timeTakenSeconds: timeTaken
    }

    setUserAnswers([...userAnswers, newAnswer])
  }

  const handleNext = () => {
    if (!showFeedback) {
      alert('Silakan klik "Submit Jawaban" terlebih dahulu')
      return
    }

    if (isLastCard) {
      handleComplete(userAnswers)
    } else {
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      if (userAnswers[currentCardIndex - 1]) {
        setCurrentAnswer(userAnswers[currentCardIndex - 1].userAnswer)
      }
    }
  }

  const handleComplete = async (allAnswers) => {
    if (window.confirm('Submit all your answers? Your progress will be saved for spaced repetition.')) {
      onSubmit(allAnswers)
    }
  }

  if (!currentCard) {
    return <div>No cards available</div>
  }

  return (
    <PlayerContainer>
      {/* Back Button */}
      <BackButton onClick={onBack}>
        ← Kembali ke Daftar Deck
      </BackButton>

      {/* Progress Bar */}
      <ProgressBar>
        <ProgressText>
          Card {currentCardIndex + 1} / {cards.length}
        </ProgressText>
        <ProgressBarBg>
          <ProgressBarFill
            progress={((currentCardIndex + 1) / cards.length) * 100}
          />
        </ProgressBarBg>
      </ProgressBar>

      {/* Card Container */}
      <CardContainer>
        <Flashcard flipped={isFlipped}>
          {/* Card Front */}
          <CardFront>
            <CardLabel>Question</CardLabel>
            <CardContent>
              {currentCard.imageUrl && (
                <CardImage src={currentCard.imageUrl} alt="Flashcard image" />
              )}
              <p>{currentCard.front || currentCard.front_text}</p>
            </CardContent>
          </CardFront>

          {/* Card Back */}
          <CardBack>
            <CardLabel>Correct Answer</CardLabel>
            <CardContent>
              <p>{currentCard.back || currentCard.back_text}</p>
            </CardContent>
          </CardBack>
        </Flashcard>
      </CardContainer>

      {/* Your Answer Input */}
      <AnswerSection>
        <AnswerLabel>Jawaban Anda:</AnswerLabel>
        <AnswerInput
          value={currentAnswer}
          onChange={(e) => setCurrentAnswer(e.target.value)}
          placeholder="Ketik jawaban Anda di sini..."
          rows="3"
          disabled={showFeedback}
        />
      </AnswerSection>

      {/* Feedback Section */}
      {showFeedback && currentFeedback && (
        <FeedbackSection>
          {currentFeedback.similarity >= 0.9 ? (
            <>
              <FeedbackBadge type="correct">✓ Jawaban Benar!</FeedbackBadge>
              <FeedbackText>
                Selamat! Jawaban Anda benar dengan tingkat kemiripan {(currentFeedback.similarity * 100).toFixed(1)}%
              </FeedbackText>
            </>
          ) : currentFeedback.similarity >= 0.7 ? (
            <>
              <FeedbackBadge type="almost">⚠ Hampir Benar</FeedbackBadge>
              <FeedbackText>
                Jawaban Anda hampir benar dengan tingkat kemiripan {(currentFeedback.similarity * 100).toFixed(1)}%, namun masih dianggap salah.
                <br />
                <strong style={{ color: '#dc3545', marginTop: '8px', display: 'block' }}>
                  💡 Kartu ini akan ditampilkan lebih awal di sesi berikutnya untuk dipelajari kembali.
                </strong>
              </FeedbackText>
            </>
          ) : (
            <>
              <FeedbackBadge type="incorrect">✗ Jawaban Salah</FeedbackBadge>
              <FeedbackText>
                Jawaban Anda kurang tepat dengan tingkat kemiripan {(currentFeedback.similarity * 100).toFixed(1)}%.
                <br />
                <strong style={{ color: '#dc3545', marginTop: '8px', display: 'block' }}>
                  💡 Kartu ini akan ditampilkan lebih awal di sesi berikutnya untuk dipelajari kembali.
                </strong>
              </FeedbackText>
            </>
          )}

          <AnswerComparison>
            <ComparisonRow>
              <ComparisonLabel>Jawaban Anda:</ComparisonLabel>
              <ComparisonValue wrong={currentFeedback.similarity < 0.9}>
                {currentFeedback.userAnswer || '(kosong)'}
              </ComparisonValue>
            </ComparisonRow>
            <ComparisonRow>
              <ComparisonLabel>Jawaban Yang Benar:</ComparisonLabel>
              <ComparisonValue correct>
                {currentFeedback.correctAnswer}
              </ComparisonValue>
            </ComparisonRow>
          </AnswerComparison>
        </FeedbackSection>
      )}

      {/* Submit Answer Button */}
      {!showFeedback && (
        <ShowAnswerSection>
          <ShowAnswerButton onClick={handleSubmitAnswer} disabled={!currentAnswer.trim()}>
            Submit Jawaban
          </ShowAnswerButton>
        </ShowAnswerSection>
      )}

      {/* Navigation Buttons */}
      <NavigationButtons>
        <SecondaryButton
          onClick={handlePrevious}
          disabled={currentCardIndex === 0}
        >
          ← Sebelumnya
        </SecondaryButton>

        {isLastCard ? (
          <PrimaryButton
            onClick={() => handleNext()}
            disabled={!showFeedback}
          >
            Selesai
          </PrimaryButton>
        ) : (
          <PrimaryButton
            onClick={handleNext}
            disabled={!showFeedback}
          >
            Selanjutnya →
          </PrimaryButton>
        )}
      </NavigationButtons>
    </PlayerContainer>
  )
}

export default FlashcardPlayer
