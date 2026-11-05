import { useState, useCallback, useRef, useEffect } from 'react'

// Which section is being edited.
//
// One at a time, because three expanded sections do not fit a 352px column — but the headers
// never collapse, so every section's state stays readable whatever is open. The first unfilled
// section opens by default: the board should land on what the student still owes.
export const useWorksheet = (sections) => {
  const [openKey, setOpenKey] = useState(null)
  const hasChosenRef = useRef(false)

  useEffect(() => {
    if (hasChosenRef.current || sections.length === 0) return

    const firstEmpty = sections.find((section) => !section.filled)
    setOpenKey(firstEmpty ? firstEmpty.key : sections[0].key)
    // Only the initial choice is automatic; after that the student is steering.
    hasChosenRef.current = true
  }, [sections])

  const toggle = useCallback((key) => {
    setOpenKey((current) => (current === key ? null : key))
  }, [])

  return { openKey, toggle }
}
