import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { saveAnswer, submitChallenge } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, TopBar, TopBarTitle, TimerBox, ProgressBar, ProgressFill,
  Main, QuestionCard, QuestionCounter, QuestionText, OptionsGrid,
  OptionBtn, OptionLetter,
} from '../Session/Session.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function getRemainingSeconds(startedAt, durationMinutes) {
  const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
  return Math.max(0, durationMinutes * 60 - elapsed)
}

export default function ClassicSession({ session, uniqueId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { questions, answeredQuestions, startedAt, durationMinutes } = session

  // Build initial answers map from previously saved answers
  const initialAnswers = Object.fromEntries(
    (answeredQuestions || []).map(a => [a.questionId, { selectedOptionIndex: a.selectedOptionIndex, timeTakenSeconds: a.timeTakenSeconds }])
  )

  // Find first unanswered question index
  const firstUnanswered = questions.findIndex(q => !(q.id in initialAnswers))
  const startIdx = firstUnanswered === -1 ? questions.length - 1 : firstUnanswered

  const [answers, setAnswers] = useState(initialAnswers)
  const [currentIdx, setCurrentIdx] = useState(startIdx)
  const [selected, setSelected] = useState(
    initialAnswers[questions[startIdx]?.id]?.selectedOptionIndex ?? null
  )
  const [secondsLeft, setSecondsLeft] = useState(() => getRemainingSeconds(startedAt, durationMinutes))
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())
  const [submitting, setSubmitting] = useState(false)
  const [locked, setLocked] = useState(false)
  const timerRef = useRef(null)
  const submittingRef = useRef(false)

  useEffect(() => {
    if (secondsLeft <= 0) {
      clearTimeout(timerRef.current)
      doSubmit()
      return
    }
    timerRef.current = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [secondsLeft])

  const handleSelect = (idx) => {
    if (locked || answers[questions[currentIdx]?.id] !== undefined) return
    const q = questions[currentIdx]
    const timeTaken = (Date.now() - questionStartTime) / 1000
    const newAnswers = { ...answers, [q.id]: { selectedOptionIndex: idx, timeTakenSeconds: timeTaken } }

    setSelected(idx)
    setLocked(true)
    setAnswers(newAnswers)
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: idx, timeTakenSeconds: timeTaken }))

    const isLast = currentIdx === questions.length - 1
    setTimeout(() => {
      if (isLast) {
        doSubmit()
      } else {
        const nextQ = questions[currentIdx + 1]
        setCurrentIdx(prev => prev + 1)
        setSelected(newAnswers[nextQ?.id]?.selectedOptionIndex ?? null)
        setQuestionStartTime(Date.now())
        setLocked(false)
      }
    }, 400)
  }

  const doSubmit = async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    clearTimeout(timerRef.current)
    try {
      const result = await dispatch(submitChallenge(uniqueId))
      navigate(ChallengeRoute.resultRoute(uniqueId), { state: { result } })
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  const currentQ = questions[currentIdx]
  const progress = (Object.keys(answers).length / questions.length) * 100
  const isUrgent = secondsLeft < 60

  return (
    <PhotoProvider>
    <PageWrapper>
      <TopBar>
        <TopBarTitle>Classic · {questions.length} soal</TopBarTitle>
        <TimerBox $urgent={isUrgent}>{formatTime(secondsLeft)}</TimerBox>
      </TopBar>

      <ProgressBar>
        <ProgressFill $pct={progress} />
      </ProgressBar>

      <Main>
        <QuestionCard>
          <QuestionCounter>
            Soal {currentIdx + 1} dari {questions.length}
            {currentQ?.isSpecial && <span style={{ marginLeft: '0.5rem', color: '#d97706', fontWeight: 700 }}>⭐ Spesial</span>}
          </QuestionCounter>

          {currentQ?.questionImage?.url && (
            <PhotoView src={currentQ.questionImage.url}>
              <img src={currentQ.questionImage.url} alt="" style={{ maxWidth: '100%', borderRadius: 8, marginBottom: '1rem', cursor: 'zoom-in' }} />
            </PhotoView>
          )}

          <QuestionText>{currentQ?.question}</QuestionText>

          <OptionsGrid>
            {(currentQ?.options || []).map((opt, idx) => (
              <OptionBtn
                key={idx}
                $selected={selected === idx}
                $locked={locked}
                onClick={() => handleSelect(idx)}
              >
                <OptionLetter $selected={selected === idx}>{OPTION_LABELS[idx]}</OptionLetter>
                {currentQ?.optionImages?.[idx]?.url
                  ? (
                    <PhotoView src={currentQ.optionImages[idx].url}>
                      <img src={currentQ.optionImages[idx].url} alt={opt} style={{ maxHeight: 60, objectFit: 'contain', cursor: 'zoom-in' }} onClick={e => e.stopPropagation()} />
                    </PhotoView>
                  )
                  : opt}
              </OptionBtn>
            ))}
          </OptionsGrid>

          {submitting && (
            <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.875rem', marginTop: '1rem' }}>
              Mengirim hasil...
            </div>
          )}
        </QuestionCard>
      </Main>
    </PageWrapper>
    </PhotoProvider>
  )
}
