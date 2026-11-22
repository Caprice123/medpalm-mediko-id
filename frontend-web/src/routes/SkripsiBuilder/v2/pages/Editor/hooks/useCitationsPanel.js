import { useState } from 'react'

// Whether the collected-references modal is open. It lives on the page rather
// than in the top bar because the bar is hidden on a phone, where the same
// button is repeated above the document — two siblings opening one modal.
export const useCitationsPanel = () => {
  const [isOpen, setIsOpen] = useState(false)

  return {
    isCitationsOpen: isOpen,
    openCitations: () => setIsOpen(true),
    closeCitations: () => setIsOpen(false),
  }
}
