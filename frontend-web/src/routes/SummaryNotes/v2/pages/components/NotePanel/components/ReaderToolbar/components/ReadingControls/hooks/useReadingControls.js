import { useCallback, useEffect, useRef, useState } from 'react'

export function useReadingControls() {
  const [isOpen, setIsOpen] = useState(false)
  const anchorRef = useRef(null)

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    if (!isOpen) return

    const handlePointerDown = (event) => {
      if (!anchorRef.current?.contains(event.target)) close()
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') close()
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, close])

  return { isOpen, anchorRef, toggle }
}
