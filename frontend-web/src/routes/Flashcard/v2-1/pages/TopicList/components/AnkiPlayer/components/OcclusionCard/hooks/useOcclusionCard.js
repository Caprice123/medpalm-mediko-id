import { useEffect, useState } from 'react'

export function useOcclusionCard({ regions, onFullyRevealed }) {
  const [visible, setVisible] = useState([])

  const revealRegion = (id) => {
    setVisible(prev => (prev.includes(id) ? prev : [...prev, id]))
  }

  const revealAll = () => setVisible(regions.map(r => r.id))

  useEffect(() => {
    if (regions.length > 0 && regions.every(r => visible.includes(r.id))) {
      onFullyRevealed?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, regions])

  return { visible, revealRegion, revealAll }
}
