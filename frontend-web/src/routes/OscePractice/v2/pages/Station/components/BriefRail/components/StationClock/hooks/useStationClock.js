import { useEffect, useRef, useState, useCallback } from 'react'
import { setInterval, clearInterval } from 'worker-timers'
import {
  ringWarningBell,
  ringEndBell,
  primeBell,
  isBellMuted,
  setBellMuted,
} from '../../../../../utils/bell'

// Where the warning bell rings. One minute matches the clock's own critical threshold, so the
// sound and the colour change together rather than telling the student two different things.
const WARNING_AT_SECONDS = 60

// The station's clock, and the bell it rings.
//
// `worker-timers` because a throttled background tab would let the clock claim time the student
// does not have; the bell has to fire on real elapsed time, not on render time.
export const useStationClock = (sessionDetail, onTimeUp) => {
  const [remaining, setRemaining] = useState(sessionDetail?.topic?.remainingTime || 0)
  const [muted, setMuted] = useState(() => isBellMuted())
  const timerRef = useRef(null)
  // Each bell may only ring once per mount, however many renders the countdown causes.
  const endFiredRef = useRef(false)
  const warningFiredRef = useRef(false)

  const toggleMuted = useCallback(() => {
    setMuted((current) => {
      const next = !current
      setBellMuted(next)
      // Unmuting is itself the user gesture browsers want before audio may play, so the
      // context is opened right here rather than left until the bell is due.
      if (!next) primeBell()
      return next
    })
  }, [])

  useEffect(() => {
    if (!sessionDetail) return

    const allocated = sessionDetail.topic?.remainingTime || 0
    setRemaining(allocated)

    if (sessionDetail.status !== 'started') return

    // Entering a station already past its bell: ring once and hand over immediately.
    if (allocated <= 1) {
      if (!endFiredRef.current) {
        endFiredRef.current = true
        ringEndBell()
        onTimeUp()
      }
      return
    }

    // A station reopened inside its last minute has already had its warning.
    if (allocated <= WARNING_AT_SECONDS) warningFiredRef.current = true

    timerRef.current = setInterval(() => {
      setRemaining((previous) => {
        const next = previous - 1

        if (next === WARNING_AT_SECONDS && !warningFiredRef.current) {
          warningFiredRef.current = true
          ringWarningBell()
        }

        if (next <= 0) {
          clearInterval(timerRef.current)
          timerRef.current = null
          if (!endFiredRef.current) {
            endFiredRef.current = true
            ringEndBell()
            onTimeUp()
          }
          return 0
        }

        return next
      })
    }, 1000)

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      timerRef.current = null
    }
  }, [sessionDetail, onTimeUp])

  return { remaining, muted, toggleMuted }
}
