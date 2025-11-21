import { useState, useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { completeFlashcardSession, fetchFlashcardAttemptDetail } from '../../../../../../store/session/action'
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
  AnswerSection,
  AnswerLabel,
  AnswerInput,
  ShowAnswerSection,
  ShowAnswerButton,
  NavigationButtons,
  PrimaryButton,
  SecondaryButton,
  CardDots,
  Dot
} from './FlashcardPlayer.styles'

const FlashcardPlayer = ({ setCurrentView }) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [showFeedback, setShowFeedback] = useState(false)
  const [currentFeedback, setCurrentFeedback] = useState(null)
  const [userAnswers, setUserAnswers] = useState([])
  const [currentAnswer, setCurrentAnswer] = useState('')
  const [startTime, setStartTime] = useState(Date.now())

  const { attemptDetail } = useSelector(state => state.session)
  const dispatch = useDispatch()

  const rawCards = attemptDetail?.cards || []

  // Memoize sorted cards - weighted random (higher incorrect = higher probability to appear first)
  const cards = useMemo(() => {
    // Calculate weighted random score for each card
    const cardsWithScore = rawCards.map(card => {
      const timesIncorrect = card.times_incorrect || 0
      const timesCorrect = card.times_correct || 0
      const total = timesCorrect + timesIncorrect

      // Weight based on incorrect rate
      // New cards (total=0) get weight 1 (neutral)
      // Cards with high incorrect rate get higher weight
      let weight = 1
      if (total > 0) {
        const incorrectRate = timesIncorrect / total
        weight = 1 + (incorrectRate * 2) // Weight ranges from 1 to 3
      }

      // Random score weighted by difficulty
      const randomScore = Math.random() * weight

      return { ...card, randomScore }
    })

    // Sort by random score descending (higher score = appears first)
    return cardsWithScore.sort((a, b) => b.randomScore - a.randomScore)
  }, [rawCards])

  const currentCard = cards[currentCardIndex]
  const isLastCard = currentCardIndex === cards.length - 1

  useEffect(() => {
    // Reset when moving to next card - NO flip animation
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
    // Calculate similarity for backend (but don't show to user)
    const correctAnswer = currentCard.back_text || currentCard.back
    const similarity = calculateSimilarity(currentAnswer, correctAnswer)

    setCurrentFeedback({
      similarity,
      userAnswer: currentAnswer,
      correctAnswer
    })

    // Flip card and show feedback
    setIsFlipped(true)
    setShowFeedback(true)

    // Save answer
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
      // Submit all answers to backend
      handleSubmit(userAnswers)
    } else {
      // Move to next card - state reset handled by useEffect
      setCurrentCardIndex(currentCardIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1)
      // Restore previous answer if exists
      if (userAnswers[currentCardIndex - 1]) {
        setCurrentAnswer(userAnswers[currentCardIndex - 1].userAnswer)
      }
    }
  }
  console.log(attemptDetail)

  const handleSubmit = async (allAnswers) => {
    if (window.confirm('Submit all your answers? This will complete the session.')) {
        // Complete the flashcard session with answers
        await dispatch(completeFlashcardSession(attemptDetail.id, allAnswers))
        dispatch(fetchFlashcardAttemptDetail(attemptDetail.id))
        setCurrentView('attempt_results')
    }
  }

  if (!currentCard) {
    return <div>No cards available</div>
  }

  return (
    <PlayerContainer>
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
              <p>{currentCard.front_text || currentCard.front}</p>
            </CardContent>
          </CardFront>

          {/* Card Back */}
          <CardBack>
            <CardLabel>Correct Answer</CardLabel>
            <CardContent>
              <p>{currentCard.back_text || currentCard.back}</p>
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

      {/* Card Navigation Dots */}
      <CardDots>
        {cards.map((_, index) => (
          <Dot
            key={index}
            active={index === currentCardIndex}
            completed={index < currentCardIndex}
            onClick={() => setCurrentCardIndex(index)}
          />
        ))}
      </CardDots>
    </PlayerContainer>
  )
}

export default FlashcardPlayer
