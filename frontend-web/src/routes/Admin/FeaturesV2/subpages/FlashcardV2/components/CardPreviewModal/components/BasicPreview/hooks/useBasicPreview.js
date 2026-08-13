import { useState } from 'react'

export function useBasicPreview() {
  const [revealed, setRevealed] = useState(false)
  const reveal = () => setRevealed(true)
  return { revealed, reveal }
}
