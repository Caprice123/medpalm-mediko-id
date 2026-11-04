import { useEffect, useRef } from 'react'

// Writes the progress straight to the fill element instead of holding it in React
// state. State here meant a re-render of the whole reader subtree — BlockNoteEditor
// included — on every animation frame of every scroll, which is what made the bar
// trail the scroll it was reporting on. Nothing else needs to know the number, so
// nothing needs to re-render for it.
//
// Takes the scroll element rather than a ref object because the reader shows a
// loading skeleton while a note is fetched: the container mounts after this hook
// first runs, and a ref object's identity never changes, so an effect keyed on one
// would attach its listener to nothing and never re-run.
export function useReadingProgress(scrollElement) {
  const fillRef = useRef(null)
  const frameRef = useRef(null)

  useEffect(() => {
    const fill = fillRef.current
    if (!fill) return

    // Progress is purely how far the container has travelled through its own height.
    // scaleX on a full-width element, not a width percentage: transforms are composited,
    // so the bar keeps up with the scroll instead of forcing layout each frame.
    const apply = () => {
      if (!scrollElement) {
        fill.style.transform = 'scaleX(0)'
        fill.parentElement?.setAttribute('aria-valuenow', '0')
        return
      }
      const scrollable = scrollElement.scrollHeight - scrollElement.clientHeight
      const ratio = scrollable <= 0
        ? 0
        : Math.min(1, Math.max(0, scrollElement.scrollTop / scrollable))
      fill.style.transform = `scaleX(${ratio})`
      fill.parentElement?.setAttribute('aria-valuenow', String(Math.round(ratio * 100)))
    }

    apply()
    if (!scrollElement) return

    const handleScroll = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        apply()
      })
    }

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    // The note's height settles once images and embeds load, which changes the
    // denominator the bar is measured against.
    const observer = new ResizeObserver(handleScroll)
    observer.observe(scrollElement)

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [scrollElement])

  return { fillRef }
}
