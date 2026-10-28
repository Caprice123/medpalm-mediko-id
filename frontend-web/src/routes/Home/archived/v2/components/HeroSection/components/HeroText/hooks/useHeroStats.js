import { useEffect, useRef, useState } from 'react'

const formatCount = (n) => `${n.toLocaleString('id-ID')}+`

export function useHeroStats(stats) {
  const containerRef = useRef(null)
  const [displayValues, setDisplayValues] = useState(stats.map(() => null))

  useEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const node = containerRef.current
    if (!node) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()

      if (reduceMotion) {
        setDisplayValues(stats.map(s => formatCount(s.count)))
        return
      }

      const start = performance.now()
      const duration = 1200

      const step = (now) => {
        const progress = Math.min(1, (now - start) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValues(stats.map(s => formatCount(Math.round(s.count * eased))))
        if (progress < 1) requestAnimationFrame(step)
      }
      requestAnimationFrame(step)
    }, { threshold: 0.3 })

    observer.observe(node)
    return () => observer.disconnect()
  }, [stats])

  return { containerRef, displayValues }
}
