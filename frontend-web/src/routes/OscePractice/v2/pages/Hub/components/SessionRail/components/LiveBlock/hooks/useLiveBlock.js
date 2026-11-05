import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { setInterval, clearInterval } from 'worker-timers'
import { OscePracticeRoute } from '@routes/OscePractice/routes'
import { actions } from '@store/oscePractice/v2/reducer'

// The rail's clock, and where its one action goes.
//
// `worker-timers` rather than window.setInterval, the same as the station room's timer: a
// background tab throttles window timers to once a minute, which would let the rail claim a
// student still has eight minutes after the bell had already rung.
export const useLiveBlock = (session, { onRequestStart }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [remaining, setRemaining] = useState(session?.remainingSeconds ?? 0)

  // A new payload (a refetch, or resuming a different station) resets the clock rather than
  // letting the old count keep running against the new station.
  useEffect(() => {
    setRemaining(session?.remainingSeconds ?? 0)
  }, [session?.uniqueId, session?.remainingSeconds])

  useEffect(() => {
    // Only a started station has a clock against it; a created one still holds its full
    // allocation and must not tick down before the student has even opened it.
    if (!session || session.status !== 'started') return
    if ((session.remainingSeconds ?? 0) <= 0) return

    const id = setInterval(() => {
      setRemaining((previous) => {
        const next = previous - 1
        if (next <= 0) {
          clearInterval(id)
          // Write the floor back to the store so every reader agrees the bell has rung.
          dispatch(actions.setResumableRemainingSeconds(0))
          return 0
        }
        return next
      })
    }, 1000)

    return () => clearInterval(id)
  }, [session?.uniqueId, session?.status, session?.remainingSeconds, dispatch])

  const open = useCallback(() => {
    if (!session) return

    // A station that was created but never started still owes its microphone and
    // speech-to-text check. V1 spent a whole page on that; here it is a gate the board raises
    // in place, so resuming never costs a navigation the student has to come back from.
    if (session.status === 'created') {
      onRequestStart(session)
      return
    }

    navigate(OscePracticeRoute.practiceRoute(session.uniqueId))
  }, [navigate, onRequestStart, session])

  return { remaining, open }
}
