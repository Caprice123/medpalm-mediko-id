import { useState, useEffect, useRef, memo } from 'react'
import {
  Sidebar,
  TimerCard,
  TimerLabel,
  TimerDisplay,
  TaskSection,
  TaskHeader,
  TaskContent,
  AutoSubmitToggle,
  ToggleSwitch,
  ToggleSlider,
  EndSessionButton,
} from '../../SessionPractice.styles'

function SessionSidebar({ session, onEndSession, isEndingSession }) {
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [autoSubmit, setAutoSubmit] = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!session) return

    // Initialize timer
    const durationInSeconds = (session.topicDurationMinutes || 15) * 60
    setTimeRemaining(durationInSeconds)

    // Start countdown timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeUp()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [session])

  const formatTime = (seconds) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${String(hrs).padStart(2, '0')}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const handleTimeUp = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    alert('Waktu habis! Sesi akan berakhir.')
    onEndSession()
  }

  return (
    <Sidebar>
      <TimerCard>
        <TimerLabel>
          <span>⏱️</span>
          WAKTU TERSISA
        </TimerLabel>
        <TimerDisplay>{formatTime(timeRemaining)}</TimerDisplay>
      </TimerCard>

      <TaskSection>
        <TaskHeader>Tugas</TaskHeader>
        <TaskContent>
          <div dangerouslySetInnerHTML={{ __html: session?.topicScenario || 'Tidak ada skenario tersedia.' }} />
        </TaskContent>

        <AutoSubmitToggle>
          <span>Kirim Otomatis Mati</span>
          <ToggleSwitch>
            <input
              type="checkbox"
              checked={autoSubmit}
              onChange={(e) => setAutoSubmit(e.target.checked)}
            />
            <ToggleSlider />
          </ToggleSwitch>
        </AutoSubmitToggle>
      </TaskSection>

      <EndSessionButton onClick={onEndSession} disabled={isEndingSession}>
        <span>{isEndingSession ? '⏳' : '🛑'}</span>
        {isEndingSession ? 'Mengevaluasi...' : 'Akhiri Sesi'}
      </EndSessionButton>
    </Sidebar>
  )
}

export default memo(SessionSidebar)
