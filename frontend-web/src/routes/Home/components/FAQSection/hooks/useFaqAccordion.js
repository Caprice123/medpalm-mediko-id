import { useState } from 'react'

export function useFaqAccordion() {
  const [openSet, setOpenSet] = useState(new Set())

  const toggle = (index) => {
    setOpenSet(prev => {
      const next = new Set(prev)
      if (next.has(index)) next.delete(index)
      else next.add(index)
      return next
    })
  }

  const isOpen = (index) => openSet.has(index)

  return { isOpen, toggle }
}
