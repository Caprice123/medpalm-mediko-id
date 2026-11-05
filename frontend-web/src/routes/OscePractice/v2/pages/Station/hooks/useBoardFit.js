import { useState, useEffect } from 'react'

// The station board fills the screen exactly, with no page scroll: the three areas scroll
// inside themselves instead.
//
// It cannot just be `height: 100vh`. The board renders inside the app shell, whose top bar is
// fixed and 44px tall and which pads the page down by that much — so a 100vh child overflows
// the viewport by exactly the bar's height, which is what pushed the worksheet's header under
// it. The offset is measured from the element rather than copied as a constant, so it stays
// right if the shell's bar changes height, disappears on mobile, or gains a second row.
//
// Two details this depends on, both of which it got wrong before:
//
//   * The value is published on the document root, not on the board. The worksheet drawer and
//     its docked toggle are fixed-position siblings of the board, not descendants, and a
//     custom property only inherits downwards — so one set on the board never reaches them.
//   * It attaches through a callback ref, not a plain one. The page renders a loading state
//     first and only mounts the board once the session has arrived, so an effect with an empty
//     dependency list runs while the board does not exist yet and never runs again.
const PROPERTY = '--osce-board-top'

export const useBoardFit = () => {
  const [board, setBoard] = useState(null)

  useEffect(() => {
    if (!board) return

    const root = document.documentElement
    let lastValue = null

    const measure = () => {
      // Distance from the top of the document, not the viewport: once the board fits there is
      // no scroll, but during the first measure there can still be one.
      const offset = Math.max(0, Math.round(board.getBoundingClientRect().top + window.scrollY))
      const value = `${offset}px`
      // Writing only on change keeps the ResizeObserver below from feeding itself.
      if (value === lastValue) return
      lastValue = value
      root.style.setProperty(PROPERTY, value)
    }

    measure()

    // The shell's bar is hidden below 768px and its sidebar animates on collapse, so the
    // offset is re-measured on both resize and the element's own geometry changes.
    const observer = new ResizeObserver(measure)
    observer.observe(root)
    observer.observe(board)
    window.addEventListener('resize', measure)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
      // Leaving the property behind would hand a stale offset to the next page that reads it.
      root.style.removeProperty(PROPERTY)
    }
  }, [board])

  // A callback ref: React calls it with the node on attach and with null on detach, so the
  // measurement starts exactly when the board appears.
  return setBoard
}
