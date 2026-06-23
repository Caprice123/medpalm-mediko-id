import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import styled from 'styled-components'
import { saveAnswer, submitChallenge } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, StickyHeader, TopBar, LeftSlot, TopBarRight, TimerBox, ScoreBadge,
  QuestionTimerBar, QuestionTimerFill,
  Main, QuestionCard, QuestionText, OptionsGrid,
  OptionBtn, OptionLetter, PointsFlash,
} from '../Session/Session.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const PhaseBadge = styled.div`
  background: ${props => props.$special ? '#fffbeb' : '#eff6ff'};
  color: ${props => props.$special ? '#b45309' : '#1d4ed8'};
  border: 1.5px solid ${props => props.$special ? '#fcd34d' : '#bfdbfe'};
  padding: 0.3rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
`

const TransitionScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
`

const TransitionTitle = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: #b45309;
  letter-spacing: 0.05em;
`

const TransitionSub = styled.div`
  font-size: 1rem;
  color: #6b7280;
`

export default function BlitzSession({ session, uniqueId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { questions, answeredQuestions, startedAt, durationSeconds } = session
  const specialDurationSeconds = session.specialDurationSeconds || 120
  const regularCount = session.regularCount ?? questions.length

  const regularQuestions = questions.slice(0, regularCount)
  const specialQuestions = questions.slice(regularCount)
  const hasSpecials = specialQuestions.length > 0

  const answeredMap = Object.fromEntries(
    (answeredQuestions || [])
      .filter(a => a.selectedOptionIndex !== null)
      .map(a => [a.questionId, a.selectedOptionIndex])
  )

  const initPhase = (() => {
    if (!hasSpecials) return 'regular'
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    return elapsed >= durationSeconds ? 'special' : 'regular'
  })()

  const initSeconds = (() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    if (hasSpecials && elapsed >= durationSeconds) {
      return Math.max(0, specialDurationSeconds - (elapsed - durationSeconds))
    }
    return Math.max(0, durationSeconds - elapsed)
  })()

  const initIdx = (() => {
    const activeQs = initPhase === 'regular' ? regularQuestions : specialQuestions
    const first = activeQs.findIndex(q => !(q.id in answeredMap))
    return first === -1 ? activeQs.length : first
  })()

  const [phase, setPhase] = useState(initPhase)
  const [secondsLeft, setSecondsLeft] = useState(initSeconds)
  const [currentIdx, setCurrentIdx] = useState(initIdx)
  const [selected, setSelected] = useState(null)
  const [locked, setLocked] = useState(false)
  const [revealed, setRevealed] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(
    (answeredQuestions || []).filter(a => a.isCorrect).length
  )
  const [showTransition, setShowTransition] = useState(false)

  const questionStartTimeRef = useRef(Date.now())
  const timerRef = useRef(null)
  const submittingRef = useRef(false)
  const handledRef = useRef(false)

  const activeQuestions = phase === 'regular' ? regularQuestions : specialQuestions
  const isPhaseExhausted = currentIdx >= activeQuestions.length
  const totalSeconds = phase === 'regular' ? durationSeconds : specialDurationSeconds
  const timerDelay = useMemo(() => -(totalSeconds - secondsLeft), [phase])
  const isUrgent = secondsLeft <= totalSeconds * 0.1

  useEffect(() => {
    const q = activeQuestions[currentIdx]
    if (!q) return
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: null, timeTakenSeconds: null }))
  }, [currentIdx, phase])

  const doSubmit = async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)
    clearTimeout(timerRef.current)
    try {
      await dispatch(submitChallenge(uniqueId))
      navigate(ChallengeRoute.resultRoute(uniqueId))
    } finally {
      setSubmitting(false)
      submittingRef.current = false
    }
  }

  useEffect(() => {
    if (submittingRef.current) return

    if (isPhaseExhausted || secondsLeft <= 0) {
      if (handledRef.current) return
      handledRef.current = true
      clearTimeout(timerRef.current)

      const currentQ = activeQuestions[currentIdx]
      if (currentQ) {
        const elapsed = (Date.now() - questionStartTimeRef.current) / 1000
        dispatch(saveAnswer(uniqueId, { questionId: currentQ.id, selectedOptionIndex: null, timeTakenSeconds: elapsed }))
      }

      if (phase === 'regular' && hasSpecials) {
        setShowTransition(true)
        setTimeout(() => {
          setShowTransition(false)
          const answeredSet = new Set((answeredQuestions || []).map(a => a.questionId))
          const firstSpecial = specialQuestions.findIndex(q => !answeredSet.has(q.id))
          setPhase('special')
          setCurrentIdx(firstSpecial === -1 ? specialQuestions.length : firstSpecial)
          setSecondsLeft(specialDurationSeconds)
          setSelected(null)
          setLocked(false)
          questionStartTimeRef.current = Date.now()
          handledRef.current = false
        }, 1800)
      } else {
        doSubmit()
      }
      return
    }

    timerRef.current = setTimeout(() => setSecondsLeft(prev => prev - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [secondsLeft, isPhaseExhausted, phase])

  const advanceNext = () => {
    setRevealed(null)
    setSelected(null)
    setLocked(false)
    setCurrentIdx(prev => prev + 1)
    questionStartTimeRef.current = Date.now()
  }

  const handleSelect = (idx) => {
    if (locked) return
    setSelected(idx)
    setLocked(true)

    const q = activeQuestions[currentIdx]
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000

    // Fallback: advance after 2.5s if server doesn't respond
    const fallback = setTimeout(advanceNext, 1200)

    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: idx, timeTakenSeconds: timeTaken }))
      .then((result) => {
        clearTimeout(fallback)
        const isCorrect = result?.isCorrect ?? false
        setRevealed({ isCorrect })
        if (isCorrect) setAnsweredCount(prev => prev + 1)
        setTimeout(advanceNext, 900)
      })
      .catch(() => {
        clearTimeout(fallback)
        advanceNext()
      })
  }

  if (submitting) {
    return (
      <PageWrapper>
        <Main>
          <div style={{ color: '#6b7280', fontSize: '1.125rem', textAlign: 'center' }}>
            Mengirim hasil...
          </div>
        </Main>
      </PageWrapper>
    )
  }

  if (showTransition) {
    return (
      <PageWrapper>
        <TransitionScreen>
          <TransitionTitle>⭐ Soal Spesial!</TransitionTitle>
          <TransitionSub>Waktu reguler habis. Soal spesial dimulai sekarang.</TransitionSub>
        </TransitionScreen>
      </PageWrapper>
    )
  }

  if (isPhaseExhausted && !handledRef.current) {
    return (
      <PageWrapper>
        <Main>
          <div style={{ color: '#6b7280', fontSize: '1.125rem', textAlign: 'center' }}>
            Semua soal telah dijawab! Mengirim...
          </div>
        </Main>
      </PageWrapper>
    )
  }

  const currentQ = activeQuestions[currentIdx]

  return (
    <PhotoProvider>
    <PageWrapper>
      <StickyHeader>
        <TopBar>
          <LeftSlot></LeftSlot>
          <TopBarRight>
            <ScoreBadge>{answeredCount} benar</ScoreBadge>
            <TimerBox $urgent={isUrgent}>{formatTime(secondsLeft)}</TimerBox>
          </TopBarRight>
        </TopBar>
        <QuestionTimerBar>
          <QuestionTimerFill
            key={phase}
            $duration={totalSeconds}
            $delay={timerDelay}
            $paused={false}
          />
        </QuestionTimerBar>
      </StickyHeader>

      <Main>
        <QuestionCard>
          {currentQ?.isSpecial && (
            <div style={{ background: '#fffbeb', border: '1px solid #fcd34d', borderRadius: 6, padding: '0.375rem 0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: '#92400e', fontWeight: 600 }}>
              ⭐ Soal Spesial — poin kamu lebih besar di soal ini!
            </div>
          )}

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
                $correct={revealed && selected === idx && revealed.isCorrect}
                $wrong={revealed && selected === idx && !revealed.isCorrect}
                onClick={() => handleSelect(idx)}
              >
                <OptionLetter
                  $selected={selected === idx}
                  $correct={revealed && selected === idx && revealed.isCorrect}
                  $wrong={revealed && selected === idx && !revealed.isCorrect}
                >{OPTION_LABELS[idx]}</OptionLetter>
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

          {revealed && (
            <PointsFlash $correct={revealed.isCorrect}>
              {revealed.isCorrect ? 'Benar!' : 'Salah'}
            </PointsFlash>
          )}
        </QuestionCard>
      </Main>
    </PageWrapper>
    </PhotoProvider>
  )
}
