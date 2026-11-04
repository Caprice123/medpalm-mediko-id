import { useCallback, useEffect, useRef, useState } from 'react'

const STORAGE_KEY = 'summaryNotesV2_sidebarWidth'
const MIN_WIDTH = 220
const MAX_WIDTH = 480
const DEFAULT_WIDTH = 280

function clampWidth(value) {
  return Math.min(MAX_WIDTH, Math.max(MIN_WIDTH, value))
}

function readStoredWidth() {
  try {
    const stored = Number(localStorage.getItem(STORAGE_KEY))
    return stored ? clampWidth(stored) : DEFAULT_WIDTH
  } catch {
    return DEFAULT_WIDTH
  }
}

// A pointer-drag handle rather than react-resizable-panels: the same sidebar has to
// become an overlay drawer on mobile, which a PanelGroup's flex layout fights. Width
// is persisted so a reader who widens the tree keeps it on the next visit.
export function useResizableSidebar() {
  const [width, setWidth] = useState(readStoredWidth)
  const [isDragging, setIsDragging] = useState(false)
  const paneRef = useRef(null)
  const widthRef = useRef(width)

  widthRef.current = width

  const handleDragStart = useCallback((event) => {
    event.preventDefault()
    setIsDragging(true)
  }, [])

  useEffect(() => {
    if (!isDragging) return

    const handleMove = (event) => {
      // Measured from the panel's own left edge, not from the viewport: the app shell
      // puts its own navigation to the left of this page, so treating clientX as the
      // width made the handle sit a sidebar's width away from the pointer.
      const paneLeft = paneRef.current?.getBoundingClientRect().left ?? 0
      setWidth(clampWidth(event.clientX - paneLeft))
    }
    const handleUp = () => {
      setIsDragging(false)
      try { localStorage.setItem(STORAGE_KEY, String(widthRef.current)) } catch { /* width is session-only */ }
    }

    window.addEventListener('pointermove', handleMove)
    window.addEventListener('pointerup', handleUp)
    window.addEventListener('pointercancel', handleUp)
    // While dragging, suppress text selection and keep the resize cursor even when
    // the pointer outruns the handle.
    const previousUserSelect = document.body.style.userSelect
    const previousCursor = document.body.style.cursor
    document.body.style.userSelect = 'none'
    document.body.style.cursor = 'col-resize'

    return () => {
      window.removeEventListener('pointermove', handleMove)
      window.removeEventListener('pointerup', handleUp)
      window.removeEventListener('pointercancel', handleUp)
      document.body.style.userSelect = previousUserSelect
      document.body.style.cursor = previousCursor
    }
  }, [isDragging])

  // Double-click restores the default, the usual escape hatch for a panel dragged to
  // a useless width.
  const handleResetWidth = useCallback(() => {
    setWidth(DEFAULT_WIDTH)
    try { localStorage.setItem(STORAGE_KEY, String(DEFAULT_WIDTH)) } catch { /* width is session-only */ }
  }, [])

  return { width, isDragging, paneRef, handleDragStart, handleResetWidth }
}
