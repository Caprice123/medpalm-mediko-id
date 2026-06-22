import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { saveAnswer, submitChallenge } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import styled from 'styled-components'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

function formatTime(seconds) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const PageWrapper = styled.div`
  min-height: 100vh;
  background: #0f172a;
  display: flex;
  flex-direction: column;
`

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
`

const CounterBadge = styled.div`
  background: rgba(255,255,255,0.1);
  color: #e2e8f0;
  padding: 0.375rem 1rem;
  border-radius: 999px;
  font-size: 0.875rem;
  font-weight: 600;
`

const PhaseBadge = styled.div`
  background: ${props => props.$special ? 'rgba(217,119,6,0.25)' : 'rgba(37,99,235,0.25)'};
  color: ${props => props.$special ? '#fbbf24' : '#93c5fd'};
  border: 1px solid ${props => props.$special ? '#d97706' : '#2563eb'};
  padding: 0.3rem 0.875rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 700;
  letter-spacing: 0.03em;
`

const TimerBox = styled.div`
  background: ${props => props.$urgent ? '#DC2626' : props.$special ? '#d97706' : '#1d4ed8'};
  color: #fff;
  padding: 0.5rem 1.25rem;
  border-radius: 8px;
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  transition: background 0.3s;
`

const Main = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem 2rem;
`

const QuestionCard = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 2.5rem;
  max-width: 680px;
  width: 100%;
`

const SpecialBadge = styled.span`
  display: inline-block;
  background: #d97706;
  color: #fff;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const QuestionText = styled.div`
  font-size: 1.125rem;
  font-weight: 500;
  color: #f1f5f9;
  line-height: 1.6;
  margin-bottom: 1.75rem;
`

const OptionsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
`

const OptionBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  padding: 0.875rem 1.25rem;
  background: ${props => props.$selected ? '#1e3a8a' : '#0f172a'};
  border: 2px solid ${props => props.$selected ? '#3b82f6' : '#334155'};
  border-radius: 10px;
  cursor: ${props => props.$locked ? 'default' : 'pointer'};
  text-align: left;
  transition: all 0.15s;
  font-size: 0.9375rem;
  color: #f1f5f9;

  &:hover {
    ${props => !props.$locked && `border-color: #60a5fa; background: #172554;`}
  }
`

const OptionLetter = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${props => props.$selected ? '#3b82f6' : '#1e293b'};
  color: ${props => props.$selected ? '#fff' : '#94a3b8'};
  font-size: 0.8125rem;
  font-weight: 700;
  flex-shrink: 0;
`

const NextBtn = styled.button`
  margin-top: 1.5rem;
  width: 100%;
  padding: 0.875rem;
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.15s;

  &:hover { background: #1d4ed8; }
  &:disabled { background: #334155; color: #64748b; cursor: not-allowed; }
`

const TransitionScreen = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #fbbf24;
`

const TransitionTitle = styled.div`
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: 0.05em;
`

const TransitionSub = styled.div`
  font-size: 1rem;
  color: #94a3b8;
`

// ─── Component ────────────────────────────────────────────────────────────────

export default function BlitzSession({ session, uniqueId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const {
    questions,
    answeredQuestions,
    startedAt,
    durationMinutes,
  } = session
  const specialDurationMinutes = session.specialDurationMinutes || 2
  const regularCount = session.regularCount ?? questions.length

  const regularQuestions = questions.slice(0, regularCount)
  const specialQuestions = questions.slice(regularCount)
  const hasSpecials = specialQuestions.length > 0

  const answeredMap = Object.fromEntries(
    (answeredQuestions || [])
      .filter(a => a.selectedOptionIndex !== null)
      .map(a => [a.questionId, a.selectedOptionIndex])
  )

  // Determine initial phase and remaining seconds based on elapsed time
  const initPhase = (() => {
    if (!hasSpecials) return 'regular'
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    return elapsed >= durationMinutes * 60 ? 'special' : 'regular'
  })()

  const initSeconds = (() => {
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000)
    if (hasSpecials && elapsed >= durationMinutes * 60) {
      return Math.max(0, specialDurationMinutes * 60 - (elapsed - durationMinutes * 60))
    }
    return Math.max(0, durationMinutes * 60 - elapsed)
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
  const [submitting, setSubmitting] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(Object.keys(answeredMap).length)
  const [showTransition, setShowTransition] = useState(false)

  const questionStartTimeRef = useRef(Date.now())

  const timerRef = useRef(null)
  const submittingRef = useRef(false)
  const handledRef = useRef(false) // prevents double-action when multiple deps change at once

  // Mark question as seen when it appears
  useEffect(() => {
    const q = activeQuestions[currentIdx]
    if (!q) return
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: null, timeTakenSeconds: null }))
  }, [currentIdx, phase])

  const activeQuestions = phase === 'regular' ? regularQuestions : specialQuestions
  const isPhaseExhausted = currentIdx >= activeQuestions.length

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

  useEffect(() => {
    if (submittingRef.current) return

    if (isPhaseExhausted || secondsLeft <= 0) {
      if (handledRef.current) return
      handledRef.current = true
      clearTimeout(timerRef.current)

      // Save elapsed time for the current question before transitioning/submitting
      const currentQ = activeQuestions[currentIdx]
      if (currentQ) {
        const elapsed = (Date.now() - questionStartTimeRef.current) / 1000
        dispatch(saveAnswer(uniqueId, { questionId: currentQ.id, selectedOptionIndex: null, timeTakenSeconds: elapsed }))
      }

      if (phase === 'regular' && hasSpecials) {
        // Transition to special phase
        setShowTransition(true)
        setTimeout(() => {
          setShowTransition(false)
          const answeredSet = new Set((answeredQuestions || []).map(a => a.questionId))
          const firstSpecial = specialQuestions.findIndex(q => !answeredSet.has(q.id))
          setPhase('special')
          setCurrentIdx(firstSpecial === -1 ? specialQuestions.length : firstSpecial)
          setSecondsLeft(specialDurationMinutes * 60)
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

  const handleSelect = (idx) => {
    if (locked) return
    setSelected(idx)
    setLocked(true)
    const q = activeQuestions[currentIdx]
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: idx, timeTakenSeconds: timeTaken }))
    setAnsweredCount(prev => prev + 1)
    setTimeout(() => {
      setCurrentIdx(prev => prev + 1)
      setSelected(null)
      setLocked(false)
      questionStartTimeRef.current = Date.now()
    }, 350)
  }

  const isUrgent = secondsLeft < 60
  const isSpecialPhase = phase === 'special'

  if (submitting) {
    return (
      <PageWrapper>
        <Main>
          <div style={{ color: '#94a3b8', fontSize: '1.125rem', textAlign: 'center' }}>
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
          <div style={{ color: '#94a3b8', fontSize: '1.125rem', textAlign: 'center' }}>
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
      <TopBar>
        <CounterBadge>Terjawab: {answeredCount} soal</CounterBadge>
        <PhaseBadge $special={isSpecialPhase}>
          {isSpecialPhase ? '⭐ Soal Spesial' : 'Soal Reguler'}
        </PhaseBadge>
        <TimerBox $urgent={isUrgent} $special={isSpecialPhase}>{formatTime(secondsLeft)}</TimerBox>
      </TopBar>

      <Main>
        <QuestionCard>
          {currentQ?.isSpecial && <SpecialBadge>⭐ Soal Spesial</SpecialBadge>}

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

          {locked && (
            <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.8125rem', marginTop: '1rem' }}>
              Melanjutkan...
            </div>
          )}
        </QuestionCard>
      </Main>
    </PageWrapper>
    </PhotoProvider>
  )
}
