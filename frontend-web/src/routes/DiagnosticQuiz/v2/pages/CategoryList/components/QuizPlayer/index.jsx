import { useState, useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { submitDiagnosticRating } from '@store/diagnosticNodes/userAction'
import {
  PlayerScreen, PlayerHeader, HeaderBar, BackBtn, HeaderTitle, HeaderCounter,
  ProgressBar, ProgressFill,
  ContentArea,
  BreadcrumbRow, BreadcrumbChip, BreadcrumbSep, NewBadge,
  ImageBlock, QuestionImage, ImageCaption,
  VignetteText, QuestionText,
  ChoiceList, ChoiceBtn, ChoiceLabel,
  AnswerReveal, ExplanationBox, ShowAnswerBtn,
  RatingFooter, RatingBtn,
} from './QuizPlayer.styles'

const RATINGS = [
  { key: 'again', label: 'Lagi',  color: '#ef4444' },
  { key: 'hard',  label: 'Sulit', color: '#f97316' },
  { key: 'good',  label: 'Baik',  color: '#3b82f6' },
  { key: 'easy',  label: 'Mudah', color: '#22c55e' },
]

const MAX_AGAIN = 2

export default function QuizPlayer({ cards, onBack }) {
  const dispatch = useDispatch()

  const [queue, setQueue] = useState(() => [...cards])
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [revealed, setRevealed] = useState(false)
  const [retryCounts, setRetryCounts] = useState({})
  const [photoOpen, setPhotoOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const card = queue[index]
  const progress = queue.length > 0 ? (index / queue.length) * 100 : 0
  const retryCount = card ? (retryCounts[card.id] || 0) : 0
  const choices = card?.choices || []
  const isTextAnswer = !choices.length || card?.answerType === 'text'

  const handleSelectChoice = useCallback((choice) => {
    if (revealed) return
    setSelected(choice)
    if (!isTextAnswer) setRevealed(true)
  }, [revealed, isTextAnswer])

  const handleReveal = useCallback(() => {
    if (!revealed) setRevealed(true)
  }, [revealed])

  const getChoiceState = (choice) => {
    if (!revealed) return selected === choice ? 'selected' : 'idle'
    if (choice === card.answer) return 'correct'
    if (choice === selected && choice !== card.answer) return 'wrong'
    return 'reveal'
  }

  const handleRate = async (ratingKey) => {
    let newQueue = queue
    if (ratingKey === 'again' && retryCount < MAX_AGAIN) {
      newQueue = [...queue, card]
      setQueue(newQueue)
      setRetryCounts(prev => ({ ...prev, [card.id]: retryCount + 1 }))
    }

    const nextIndex = index + 1
    if (nextIndex >= newQueue.length) {
      await dispatch(submitDiagnosticRating(card.id, ratingKey))
      onBack()
    } else {
      dispatch(submitDiagnosticRating(card.id, ratingKey))
      setIndex(nextIndex)
      setSelected(null)
      setRevealed(false)
    }
  }

  if (!card) return null

  const topicName = card.topic?.name
  const subtopicName = card.subtopic?.name

  return (
    <PhotoProvider visible={photoOpen} onVisibleChange={setPhotoOpen}>
      {card.imageUrl && (
        <PhotoView src={card.imageUrl}>
          <span style={{ display: 'none' }} />
        </PhotoView>
      )}

      <PlayerScreen>
        <PlayerHeader>
          <HeaderBar>
            <BackBtn onClick={onBack} aria-label="Kembali">‹</BackBtn>
            <HeaderTitle>Sesi Latihan</HeaderTitle>
            <HeaderCounter><b>{index + 1}</b> / {queue.length}</HeaderCounter>
          </HeaderBar>
          <ProgressBar>
            <ProgressFill $progress={progress} />
          </ProgressBar>
        </PlayerHeader>

        <ContentArea $hasFooter={revealed}>
          {(topicName || subtopicName || card.isNew) && (
            <BreadcrumbRow>
              {topicName && <BreadcrumbChip>{topicName}</BreadcrumbChip>}
              {topicName && subtopicName && <BreadcrumbSep>›</BreadcrumbSep>}
              {subtopicName && <BreadcrumbChip>{subtopicName}</BreadcrumbChip>}
              {card.isNew && <NewBadge>Baru</NewBadge>}
            </BreadcrumbRow>
          )}

          {card.imageUrl && (
            <>
              <ImageBlock onClick={() => setPhotoOpen(true)}>
                <QuestionImage src={card.imageUrl} alt="" />
              </ImageBlock>
              {card.imageCaption && <ImageCaption>{card.imageCaption}</ImageCaption>}
            </>
          )}

          {card.vignette && <VignetteText>{card.vignette}</VignetteText>}

          <QuestionText>{card.question}</QuestionText>

          {!isTextAnswer && (
            <ChoiceList>
              {choices.map((choice, i) => {
                const state = getChoiceState(choice)
                return (
                  <ChoiceBtn
                    key={i}
                    $state={state}
                    $disabled={revealed}
                    onClick={() => handleSelectChoice(choice)}
                    disabled={revealed}
                  >
                    <ChoiceLabel $state={state}>
                      {String.fromCharCode(65 + i)}
                    </ChoiceLabel>
                    {choice}
                  </ChoiceBtn>
                )
              })}
            </ChoiceList>
          )}

          {revealed && isTextAnswer && (
            <AnswerReveal>Jawaban: {card.answer}</AnswerReveal>
          )}

          {revealed && card.explanation && (
            <ExplanationBox>
              <strong>Penjelasan:</strong> {card.explanation}
            </ExplanationBox>
          )}

          {!revealed && isTextAnswer && (
            <ShowAnswerBtn onClick={handleReveal}>Lihat Jawaban</ShowAnswerBtn>
          )}
        </ContentArea>

        {revealed && (
          <RatingFooter>
            {RATINGS.map(r => (
              <RatingBtn
                key={r.key}
                $color={r.color}
                onClick={() => handleRate(r.key)}
                disabled={r.key === 'again' && retryCount >= MAX_AGAIN}
                title={r.key === 'again' && retryCount >= MAX_AGAIN ? 'Batas ulang tercapai' : undefined}
              >
                {r.label}
                {r.key === 'again' && retryCount > 0 && retryCount < MAX_AGAIN && (
                  <span style={{ fontSize: '0.625rem', display: 'block', opacity: 0.7 }}>
                    {MAX_AGAIN - retryCount}x lagi
                  </span>
                )}
              </RatingBtn>
            ))}
          </RatingFooter>
        )}
      </PlayerScreen>
    </PhotoProvider>
  )
}
