import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { setTimeout, clearTimeout } from 'worker-timers'
import { saveAnswer, submitChallenge } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, StickyHeader, TopBar, LeftSlot, TopBarRight, TimerBox,
  QuestionTimerBar, QuestionTimerFill, StreakBadge, ScoreBadge, PointsFlash,
  Main, QuestionCard, QuestionCounter, QuestionText, OptionsGrid,
  OptionBtn, OptionLetter,
} from '../Session/Session.styles'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

function getStreakMultiplier(streak) {
  if (streak >= 5) return 2
  if (streak >= 3) return 1.5
  return 1
}

function computePoints(basePoints, isSpecial, timeTaken, secondsPerQuestion, streak) {
  const timeLeft = Math.max(0, secondsPerQuestion - timeTaken)
  const speedFactor = 0.5 + 0.5 * (timeLeft / secondsPerQuestion)
  const pointMult = isSpecial ? 2 : 1
  const streakMult = getStreakMultiplier(streak)
  return Math.round(basePoints * pointMult * speedFactor * streakMult)
}

export default function ClassicSession({ session, uniqueId }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { questions, answeredQuestions, secondsPerQuestion, basePointsPerCorrect } = session

  const initialAnswers = Object.fromEntries(
    (answeredQuestions || []).map(a => [a.questionId, { selectedOptionIndex: a.selectedOptionIndex, timeTakenSeconds: a.timeTakenSeconds }])
  )

  // Resume at the last question that has any record (answered or seen/timed-out)
  const lastSeenIdx = questions.reduce((last, q, idx) => (q.id in initialAnswers ? idx : last), -1)
  const startIdx = lastSeenIdx === -1 ? 0 : lastSeenIdx

  const [currentIdx, setCurrentIdx] = useState(startIdx)
  const [answers, setAnswers] = useState(initialAnswers)
  const [selected, setSelected] = useState(initialAnswers[questions[startIdx]?.id]?.selectedOptionIndex ?? null)
  const [questionTimer, setQuestionTimer] = useState(() => {
    const q = questions[startIdx]
    if (!q) return secondsPerQuestion
    const stored = localStorage.getItem(`qs_${uniqueId}_${q.id}`)
    if (!stored) return secondsPerQuestion
    const elapsed = Math.floor((Date.now() - parseInt(stored)) / 1000)
    return Math.max(0, secondsPerQuestion - elapsed)
  })
  const [streak, setStreak] = useState(0)
  const [totalScore, setTotalScore] = useState(0)
  const [pointsFlash, setPointsFlash] = useState(null)
  const [revealed, setRevealed] = useState(null) // { isCorrect } — shows feedback highlight on options
  const [locked, setLocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Refs to avoid stale closures in timer callbacks
  const currentIdxRef = useRef(startIdx)
  const answersRef = useRef(initialAnswers)
  const streakRef = useRef(0)
  const lockedRef = useRef(false)
  const questionStartTimeRef = useRef((() => {
    const q = questions[startIdx]
    if (!q) return Date.now()
    const stored = localStorage.getItem(`qs_${uniqueId}_${q.id}`)
    return stored ? parseInt(stored) : Date.now()
  })())
  const timerRef = useRef(null)
  const submittingRef = useRef(false)

  // Keep refs in sync
  useEffect(() => { currentIdxRef.current = currentIdx }, [currentIdx])
  useEffect(() => { answersRef.current = answers }, [answers])

  // Mark question as seen and record start time when it appears for the first time
  useEffect(() => {
    const q = questions[currentIdx]
    if (!q) return
    const key = `qs_${uniqueId}_${q.id}`
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, Date.now().toString())
    }
    const existing = answersRef.current[q.id]
    if (existing && existing.selectedOptionIndex !== null) return
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: null, timeTakenSeconds: null }))
  }, [currentIdx])

  // Frozen per-question delay for the progress bar animation
  const timerDelay = useMemo(() => {
    const q = questions[currentIdx]
    if (!q) return 0
    const stored = localStorage.getItem(`qs_${uniqueId}_${q.id}`)
    if (!stored) return 0
    const elapsed = (Date.now() - parseInt(stored)) / 1000
    return -Math.min(elapsed, secondsPerQuestion)
  }, [currentIdx])

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

  const goNext = () => {
    const nextIdx = currentIdxRef.current + 1
    if (nextIdx >= questions.length) {
      doSubmit()
      return
    }
    currentIdxRef.current = nextIdx
    lockedRef.current = false
    setRevealed(null)
    setCurrentIdx(nextIdx)
    setAnswers({ ...answersRef.current })
    setSelected(answersRef.current[questions[nextIdx]?.id]?.selectedOptionIndex ?? null)
    questionStartTimeRef.current = Date.now()
    setQuestionTimer(secondsPerQuestion)
    setLocked(false)
  }

  // Per-question countdown
  useEffect(() => {
    if (lockedRef.current) return
    if (questionTimer <= 0) {
      lockedRef.current = true
      setLocked(true)
      streakRef.current = 0
      setStreak(0)
      setPointsFlash({ timedOut: true, points: 0, isCorrect: false })
      const q = questions[currentIdxRef.current]
      if (q) dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: null, timeTakenSeconds: secondsPerQuestion }))
      const t = setTimeout(() => {
        setPointsFlash(null)
        goNext()
      }, 800)
      return () => clearTimeout(t)
    }
    timerRef.current = setTimeout(() => setQuestionTimer(prev => prev - 1), 1000)
    return () => clearTimeout(timerRef.current)
  }, [questionTimer])

  const handleSelect = (idx) => {
    if (lockedRef.current) return
    clearTimeout(timerRef.current)

    const q = questions[currentIdxRef.current]
    const timeTaken = (Date.now() - questionStartTimeRef.current) / 1000
    const newAnswers = { ...answersRef.current, [q.id]: { selectedOptionIndex: idx, timeTakenSeconds: timeTaken } }

    answersRef.current = newAnswers
    lockedRef.current = true
    setSelected(idx)
    setLocked(true)
    setAnswers(newAnswers)

    const advanceWithResult = (isCorrect) => {
      if (isCorrect) {
        streakRef.current++
      } else {
        streakRef.current = 0
      }
      setStreak(streakRef.current)
      setRevealed({ isCorrect })
      const pts = isCorrect
        ? computePoints(basePointsPerCorrect, q.isSpecial, timeTaken, secondsPerQuestion, streakRef.current)
        : 0
      setPointsFlash({ points: pts, isCorrect, streak: streakRef.current })
      if (isCorrect) setTotalScore(prev => prev + pts)
      setTimeout(() => { setPointsFlash(null); goNext() }, 900)
    }

    // Fallback: advance after 3s even if server is slow
    const fallbackTimer = setTimeout(() => advanceWithResult(false), 1500)

    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: idx, timeTakenSeconds: timeTaken }))
      .then((result) => {
        clearTimeout(fallbackTimer)
        advanceWithResult(result?.isCorrect ?? false)
      })
  }

  const currentQ = questions[currentIdx]
  const timerPct = (questionTimer / secondsPerQuestion) * 100
  const isUrgent = questionTimer <= Math.ceil(secondsPerQuestion * 0.25)

  return (
    <PhotoProvider>
    <PageWrapper>
      <StickyHeader>
        <TopBar>
          <LeftSlot />
          <TopBarRight>
            <ScoreBadge>{totalScore} pts</ScoreBadge>
            {streak >= 2 && <StreakBadge>🔥 {streak}</StreakBadge>}
            <TimerBox $urgent={isUrgent}>{questionTimer}s</TimerBox>
          </TopBarRight>
        </TopBar>
        <QuestionTimerBar>
          <QuestionTimerFill key={currentIdx} $duration={secondsPerQuestion} $delay={timerDelay} $paused={locked} />
        </QuestionTimerBar>
      </StickyHeader>

      <Main>
        <QuestionCard>
          <QuestionCounter>
            <span>Soal {currentIdx + 1} dari {questions.length}</span>
          </QuestionCounter>

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

          {pointsFlash && (
            <PointsFlash $correct={pointsFlash.isCorrect}>
              {pointsFlash.timedOut
                ? '⏱ Waktu habis!'
                : pointsFlash.isCorrect
                  ? `+${pointsFlash.points} pts${pointsFlash.streak >= 3 ? ` 🔥 ×${getStreakMultiplier(pointsFlash.streak)}` : ''}`
                  : '✗ Salah'}
            </PointsFlash>
          )}

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
