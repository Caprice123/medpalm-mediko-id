import { useState } from 'react'

export function useFaqAccordion() {
  const [openIndex, setOpenIndex] = useState(null)

  const isOpen = (index) => openIndex === index
  const toggle = (index) => setOpenIndex((current) => (current === index ? null : index))

  return { isOpen, toggle }
}
