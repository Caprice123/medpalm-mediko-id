import { useCallback, useEffect, useState } from 'react'

const DEFAULT_WIDTH = 380
const MIN_WIDTH = 320
const MAX_WIDTH_RATIO = 0.95
const STORAGE_KEY = 'topicHub.previewPanelWidth'

const clampWidth = (value) => {
  const max = Math.max(MIN_WIDTH, window.innerWidth * MAX_WIDTH_RATIO)
  return Math.round(Math.min(Math.max(value, MIN_WIDTH), max))
}

const readStoredWidth = () => {
  try {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY), 10)
    return Number.isFinite(stored) ? clampWidth(stored) : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

export default function usePreviewPanel({ open }) {
  const [width, setWidth] = useState(readStoredWidth)
  const [isResizing, setIsResizing] = useState(false)

  // lock the body while the drawer is open so the page underneath can't scroll
  useEffect(() => {
    if (!open) return
    const prevHeight = document.body.style.height
    const prevOverflow = document.body.style.overflow
    document.body.style.height = '100vh'
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.height = prevHeight
      document.body.style.overflow = prevOverflow
    }
  }, [open])

  // drag the left edge: the drawer is right-anchored, so width is the distance
  // between the pointer and the right edge of the viewport
  useEffect(() => {
    if (!isResizing) return

    const handleMove = (e) => setWidth(clampWidth(window.innerWidth - e.clientX))
    const handleUp = () => setIsResizing(false)

    // keep the resize cursor and kill text selection for the whole drag
    const prevCursor = document.body.style.cursor
    const prevUserSelect = document.body.style.userSelect
    document.body.style.cursor = 'col-resize'
    document.body.style.userSelect = 'none'

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    return () => {
      document.body.style.cursor = prevCursor
      document.body.style.userSelect = prevUserSelect
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
    }
  }, [isResizing])

  // keep the panel inside the viewport when the window itself is resized
  useEffect(() => {
    const handleWindowResize = () => setWidth(current => clampWidth(current))
    window.addEventListener('resize', handleWindowResize)
    return () => window.removeEventListener('resize', handleWindowResize)
  }, [])

  // persist only once the drag settles, so a drag doesn't spam localStorage
  useEffect(() => {
    if (isResizing) return
    try {
      localStorage.setItem(STORAGE_KEY, String(width))
    } catch {
      // storage unavailable (private mode) — width simply won't persist
    }
  }, [isResizing, width])

  const startResize = useCallback((e) => {
    e.preventDefault()
    setIsResizing(true)
  }, [])

  const resetWidth = useCallback(() => setWidth(DEFAULT_WIDTH), [])

  return { width, isResizing, startResize, resetWidth }
}
