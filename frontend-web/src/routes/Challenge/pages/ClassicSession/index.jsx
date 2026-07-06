import { useEffect, useMemo, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PhotoProvider, PhotoView } from 'react-photo-view'
import 'react-photo-view/dist/react-photo-view.css'
import { setTimeout, clearTimeout } from 'worker-timers'
import { saveAnswer, submitChallenge } from '@store/challenge/userAction'
import { ChallengeRoute } from '../../routes'
import {
  PageWrapper, StickyHeader, TimerBox,
  QuestionTimerBar, QuestionTimerFill, StreakBadge, ScoreBadge, CardStats, PointsFlash,
  Main, QuestionCard, QuestionCounter, QuestionText, OptionsGrid,
  OptionBtn, OptionLetter,
  SpecialOverlay, SpecialCard, SpecialCardTitle, SpecialCardSub, SpecialStar,
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

  const { questions, answeredQuestions, secondsPerQuestion, basePointsPerCorrect, currentStreak: resumedStreak, score: resumedScore } = session

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
  const [streak, setStreak] = useState(resumedStreak ?? 0)
  const [totalScore, setTotalScore] = useState(resumedScore ?? 0)
  const [pointsFlash, setPointsFlash] = useState(null)
  const [revealed, setRevealed] = useState(null) // { isCorrect } — shows feedback highlight on options
  const [locked, setLocked] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [showSpecialAnnounce, setShowSpecialAnnounce] = useState(false)
  const [specialOut, setSpecialOut] = useState(false)

  // Refs to avoid stale closures in timer callbacks
  const currentIdxRef = useRef(startIdx)
  const answersRef = useRef(initialAnswers)
  const streakRef = useRef(resumedStreak ?? 0)
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

  // Special question announcement
  useEffect(() => {
    if (!questions[currentIdx]?.isSpecial) return
    setSpecialOut(false)
    setShowSpecialAnnounce(true)
    const t1 = setTimeout(() => setSpecialOut(true), 1300)
    const t2 = setTimeout(() => setShowSpecialAnnounce(false), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [currentIdx])

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
    questions.forEach(q => localStorage.removeItem(`qs_${uniqueId}_${q.id}`))
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
      if (q) {
        localStorage.removeItem(`qs_${uniqueId}_${q.id}`)
        dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: null, timeTakenSeconds: secondsPerQuestion }))
      }
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

    const advanceWithResult = (isCorrect, serverStreak = null, serverTotalScore = null, serverPointsEarned = null) => {
      let newStreak, pts
      if (serverStreak !== null || serverTotalScore !== null) {
        newStreak = serverStreak ?? streakRef.current
        pts = serverPointsEarned ?? 0
        streakRef.current = newStreak
        setStreak(newStreak)
        setTotalScore(serverTotalScore ?? 0)
      } else {
        if (isCorrect) {
          streakRef.current++
        } else {
          streakRef.current = 0
        }
        newStreak = streakRef.current
        pts = isCorrect ? computePoints(basePointsPerCorrect, q.isSpecial, timeTaken, secondsPerQuestion, newStreak) : 0
        setStreak(newStreak)
        if (isCorrect) setTotalScore(prev => prev + pts)
      }
      setRevealed({ isCorrect })
      setPointsFlash({ points: pts, isCorrect, streak: newStreak })
      setTimeout(() => { setPointsFlash(null); goNext() }, 900)
    }

    // Fallback: advance after 1.5s even if server is slow
    const fallbackTimer = setTimeout(() => advanceWithResult(false), 1500)

    localStorage.removeItem(`qs_${uniqueId}_${q.id}`)
    dispatch(saveAnswer(uniqueId, { questionId: q.id, selectedOptionIndex: idx, timeTakenSeconds: timeTaken }))
      .then((result) => {
        clearTimeout(fallbackTimer)
        advanceWithResult(
          result?.isCorrect ?? false,
          result?.streak ?? null,
          result?.totalScore ?? null,
          result?.pointsEarned ?? null,
        )
      })
  }

  const currentQ = questions[currentIdx]
  const timerPct = (questionTimer / secondsPerQuestion) * 100
  const isUrgent = questionTimer <= Math.ceil(secondsPerQuestion * 0.25)

  return (
    <PhotoProvider>
    {showSpecialAnnounce && (
      <SpecialOverlay $out={specialOut}>
        <SpecialCard>
          <SpecialStar $tx="-90px" $ty="-75px" $delay={0.05} $size="2.25rem">⭐</SpecialStar>
          <SpecialStar $tx="90px"  $ty="-75px" $delay={0.15} $size="1.75rem">✨</SpecialStar>
          <SpecialStar $tx="-110px" $ty="10px" $delay={0.1}  $size="1.5rem">🌟</SpecialStar>
          <SpecialStar $tx="110px"  $ty="10px" $delay={0.2}  $size="1.75rem">⭐</SpecialStar>
          <SpecialStar $tx="-70px"  $ty="65px" $delay={0.25} $size="1.25rem">✨</SpecialStar>
          <SpecialStar $tx="70px"   $ty="65px" $delay={0.08} $size="1.5rem">🌟</SpecialStar>
          <SpecialCardTitle>⭐ Soal Spesial!</SpecialCardTitle>
          <SpecialCardSub>Poin kamu lebih besar di soal ini 🎯</SpecialCardSub>
        </SpecialCard>
      </SpecialOverlay>
    )}
    <PageWrapper>
      <StickyHeader>
        <QuestionTimerBar>
          <QuestionTimerFill key={currentIdx} $duration={secondsPerQuestion} $delay={timerDelay} $paused={locked} />
        </QuestionTimerBar>
      </StickyHeader>

      <Main>
        <QuestionCard $isSpecial={currentQ?.isSpecial}>
          <QuestionCounter>
            <span>Soal {currentIdx + 1} dari {questions.length}</span>
            <CardStats>
              {streak >= 2 && <StreakBadge $compact>🔥 {streak}</StreakBadge>}
              <ScoreBadge $compact>{totalScore} pts</ScoreBadge>
              <TimerBox $compact $urgent={isUrgent}>⏱ {questionTimer}s</TimerBox>
            </CardStats>
          </QuestionCounter>

          {currentQ?.isSpecial && (
            <div style={{ background: '#fffbeb', border: '1.5px solid #f59e0b', borderRadius: 6, padding: '0.3rem 0.75rem', marginBottom: '1rem', fontSize: '0.8125rem', color: '#92400e', fontWeight: 700 }}>
              ⭐ Soal Spesial
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
