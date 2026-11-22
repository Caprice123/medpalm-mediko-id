import { useEffect, useRef, useState } from 'react'

// Below this the outline would be taking space the prose needs, so it goes
// back to being a strip across the top.
const RAIL_MIN_WIDTH = 880

// Whether the document pane is wide enough to put the outline beside the sheet
// rather than above it.
//
// This watches the pane itself, not the window: the split between the side
// panel and the document is draggable, so the viewport says nothing useful
// about how much room this pane actually has.
export const useSectionsLayout = () => {
  const canvasRef = useRef(null)
  const [isRail, setIsRail] = useState(false)

  useEffect(() => {
    const element = canvasRef.current
    if (!element) return

    const observer = new ResizeObserver(([entry]) => {
      setIsRail(entry.contentRect.width >= RAIL_MIN_WIDTH)
    })

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return { canvasRef, isRail }
}
