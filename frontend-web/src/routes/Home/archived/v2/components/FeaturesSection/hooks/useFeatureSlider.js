import { useEffect, useRef, useState } from 'react'

const DURATION = 7000

export function useFeatureSlider(count) {
  const [current, setCurrent] = useState(0)
  const [progress, setProgress] = useState(0)
  const [playingVideo, setPlayingVideo] = useState(false)
  const pausedRef = useRef(false)

  const go = (index) => {
    setCurrent(((index % count) + count) % count)
    setPlayingVideo(false)
  }

  useEffect(() => {
    setProgress(0)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) return undefined

    const start = performance.now()
    let pausedAt = null
    let pausedTotal = 0
    let raf

    const tick = (now) => {
      if (pausedRef.current) {
        if (pausedAt === null) pausedAt = now
        raf = requestAnimationFrame(tick)
        return
      }
      if (pausedAt !== null) {
        pausedTotal += now - pausedAt
        pausedAt = null
      }

      const elapsed = now - start - pausedTotal
      const pct = Math.min(100, (elapsed / DURATION) * 100)
      setProgress(pct)

      if (pct >= 100) {
        go(current + 1)
        return
      }
      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, count])

  const setPaused = (value) => {
    pausedRef.current = value
  }

  let touchStartX = null
  const onPointerDown = (e) => { touchStartX = e.clientX }
  const onPointerUp = (e) => {
    if (touchStartX === null) return
    const dx = e.clientX - touchStartX
    touchStartX = null
    if (Math.abs(dx) > 50) go(current + (dx < 0 ? 1 : -1))
  }

  return {
    current,
    progress,
    go,
    playingVideo,
    playVideo: () => {
      setPlayingVideo(true)
      setPaused(true)
    },
    onMouseEnter: () => setPaused(true),
    onMouseLeave: () => { if (!playingVideo) setPaused(false) },
    onFocus: () => setPaused(true),
    onBlur: () => { if (!playingVideo) setPaused(false) },
    onPointerDown,
    onPointerUp,
  }
}
