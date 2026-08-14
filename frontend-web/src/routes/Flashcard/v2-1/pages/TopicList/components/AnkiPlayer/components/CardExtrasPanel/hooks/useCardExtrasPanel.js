import { useState } from 'react'

export function useCardExtrasPanel() {
  const [showLong, setShowLong] = useState(false)
  const toggleLong = () => setShowLong(v => !v)
  return { showLong, toggleLong }
}
