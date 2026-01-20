import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { TimerCard, TimerDisplay, TimerLabel } from '../../../../SessionPractice.styles'

const TimerSection = ({ onEndSession }) => {
    const { sessionDetail } = useSelector(state => state.oscePractice)
    const [timeRemaining, setTimeRemaining] = useState(0)
    const timerRef = useRef(null)

    useEffect(() => {
        if (!sessionDetail) return

        // Only start timer if session is actually started
        if (sessionDetail.status !== 'started') {
            setTimeRemaining(sessionDetail.topic.remainingTime || 0)
            return
        }

        // Initialize timer
        const durationInSeconds = sessionDetail.topic.remainingTime || 0
        setTimeRemaining(durationInSeconds)

        // Only auto-end if session is started and time is actually up
        if (durationInSeconds <= 1) {
            handleTimeUp()
            return
        }

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
    }, [sessionDetail])

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
        // Pass true to indicate auto-end (skip confirmation)
        onEndSession(true)
    }

  return (
    <TimerCard>
        <TimerLabel>
            <span>⏱️</span>
            WAKTU TERSISA
        </TimerLabel>
        <TimerDisplay>{formatTime(timeRemaining)}</TimerDisplay>
    </TimerCard>
  )
}

export default TimerSection