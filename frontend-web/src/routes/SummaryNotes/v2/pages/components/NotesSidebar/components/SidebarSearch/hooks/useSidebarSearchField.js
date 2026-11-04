import { useCallback, useRef, useState } from 'react'

export function useSidebarSearchField(onClear) {
  const [isFocused, setIsFocused] = useState(false)
  const inputRef = useRef(null)

  const handleFocus = useCallback(() => setIsFocused(true), [])
  const handleBlur = useCallback(() => setIsFocused(false), [])

  // Escape clears without leaving the field, so a reader can retry a search
  // immediately instead of selecting the old query by hand.
  const handleKeyDown = useCallback((event) => {
    if (event.key !== 'Escape') return
    event.stopPropagation()
    onClear()
    inputRef.current?.focus()
  }, [onClear])

  return { isFocused, inputRef, handleFocus, handleBlur, handleKeyDown }
}
