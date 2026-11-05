import { useState, useEffect, useRef } from 'react'

export function useColorPickerButton() {
  const [open, setOpen] = useState(false)
  const wrapRef = useRef(null)

  // The popover sits inside a scrolling form, so a click anywhere else should close it
  // rather than leaving a stray swatch panel floating over the fields below.
  useEffect(() => {
    if (!open) return
    const handleClickOutside = (event) => {
      if (!wrapRef.current?.contains(event.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return {
    open,
    wrapRef,
    toggle: () => setOpen(o => !o),
    close: () => setOpen(false),
  }
}
