import { useState, useEffect, useCallback } from 'react'

// Below this width the board can no longer hold three columns without squeezing the
// conversation below a readable measure, so the worksheet becomes a drawer instead.
const THREE_COLUMN_MIN = '(min-width: 1321px)'

// Whether the worksheet has its own column or is a drawer over the board.
//
// Owned by the page because two things depend on it: the board's grid, and the docked toggle
// that has to appear only when the column is gone.
export const useWorksheetDrawer = () => {
  const [hasColumn, setHasColumn] = useState(
    () => (typeof window === 'undefined' ? true : window.matchMedia(THREE_COLUMN_MIN).matches),
  )
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  useEffect(() => {
    const query = window.matchMedia(THREE_COLUMN_MIN)
    const handle = (event) => {
      setHasColumn(event.matches)
      // Widening back to three columns closes the drawer, otherwise the worksheet would be
      // open twice — once as a column, once as an overlay.
      if (event.matches) setIsDrawerOpen(false)
    }

    query.addEventListener('change', handle)
    return () => query.removeEventListener('change', handle)
  }, [])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])

  return {
    // Rendered either way; what changes is whether it sits in the grid or over it.
    isWorksheetVisible: hasColumn || isDrawerOpen,
    hasColumn,
    isDrawerOpen,
    openDrawer,
    closeDrawer,
  }
}
