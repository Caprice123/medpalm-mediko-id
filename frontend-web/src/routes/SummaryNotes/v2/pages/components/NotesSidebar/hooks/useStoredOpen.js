import { useState, useCallback } from 'react'

function readStoredOpen(key) {
  try {
    const v = localStorage.getItem(key)
    return v === null ? true : v === 'true'
  } catch {
    return true
  }
}

export function useStoredOpen(key) {
  const [open, setOpen] = useState(() => readStoredOpen(key))
  const toggle = useCallback(() => {
    setOpen(prev => {
      const next = !prev
      try { localStorage.setItem(key, String(next)) } catch {}
      return next
    })
  }, [key])
  return [open, toggle]
}
