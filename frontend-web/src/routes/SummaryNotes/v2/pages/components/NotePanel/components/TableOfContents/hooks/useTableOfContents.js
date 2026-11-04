import { useCallback, useState } from 'react'

// Closed by default, because this disclosure only exists on narrow screens where the
// list sits above the article — an outline of a dozen headings open on arrival would
// push the note itself off the screen. Deliberately not persisted: it is a glance,
// not a setting. On wide screens the styles force the list open and the toggle inert,
// so this state simply goes unused there.
//
// Jumping deliberately leaves the list open. Collapsing it first removed up to a
// screenful of height from the flow *above* the target heading, while the jump had
// already been measured against the taller layout — and the collapse animates over
// 0.2s, so the ground kept moving under the smooth scroll. Leaving it alone costs
// nothing: once the jump lands, the list is far above the viewport anyway.
export function useTableOfContents() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen(prev => !prev), [])

  return { isOpen, toggle }
}
