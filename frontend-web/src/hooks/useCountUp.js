import { useEffect, useRef, useState } from 'react'

// Counts up to `target`, starting from whatever is on screen right now.
//
// The first sweep runs from zero, because that is where the component mounts.
// Every sweep after that starts at the figure already displayed, so when the
// polled stats come back a few higher the number ticks up those few rather
// than dropping to zero and climbing all the way back.
//
// Shared by the landing hero's floating stat cards and the sign-in card's
// count row, so both run at the same speed and easing.

// The opening sweep is a flourish and can afford the time. A later correction
// of a handful of units is not, and at 1.6s it reads as a glitch.
const INITIAL_DURATION = 1600
const UPDATE_DURATION = 600

export function useCountUp(target) {
  const [value, setValue] = useState(0)
  // The animation reads its own starting point, and reading it from state
  // would make every sweep restart itself on its first frame.
  const displayed = useRef(0)

  useEffect(() => {
    if (typeof target !== 'number' || !Number.isFinite(target)) return undefined

    const from = displayed.current
    if (from === target) return undefined

    // A counter sweeping up is motion for its own sake; anyone who asked for
    // less of it gets the final figure immediately.
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

    if (reduced) {
      displayed.current = target
      setValue(target)
      return undefined
    }

    const duration = from === 0 ? INITIAL_DURATION : UPDATE_DURATION
    let frame
    let start

    const tick = (now) => {
      if (start === undefined) start = now
      const progress = Math.min((now - start) / duration, 1)
      // Ease-out exponential: fast off the mark, settling onto the real figure
      // rather than crawling the last few hundred.
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      const next = Math.round(from + (target - from) * eased)

      displayed.current = next
      setValue(next)
      if (progress < 1) frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frame)
  }, [target])

  return value
}

export default useCountUp
