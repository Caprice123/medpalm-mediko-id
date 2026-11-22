import { useCallback, useEffect, useState } from 'react'
import { PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { sectionDomId, SECTION_DOM_ID_PREFIX } from '../../../utils/sectionDomId'

const OPEN_KEY = 'skripsi-v2-toc-open'

// localStorage throws outright in a private window or with site data blocked,
// so the default has to survive that rather than only a missing key.
const readStoredOpen = () => {
  try {
    return localStorage.getItem(OPEN_KEY) === 'true'
  } catch {
    return false
  }
}

// The outline's own state: whether it is open, which section is on screen, and
// the drag that reorders it.
export const useTableOfContents = ({ sections, isRail, onReorder }) => {
  const [isCollapsedOpen, setIsCollapsedOpen] = useState(readStoredOpen)

  // As a rail there is nothing to collapse into — it is a column of its own,
  // not width taken from the prose.
  const isOpen = isRail || isCollapsedOpen
  const [activeId, setActiveId] = useState(null)

  const toggle = useCallback(() => {
    setIsCollapsedOpen((previous) => {
      const next = !previous
      try {
        localStorage.setItem(OPEN_KEY, String(next))
      } catch {
        // A closed outline is not worth failing over.
      }
      return next
    })
  }, [])

  // A drag must not start on a plain click, or picking an entry to jump to
  // would nudge the order instead.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    onReorder(active.id, over.id)
  }, [onReorder])

  const jumpTo = useCallback((sectionId) => {
    document.getElementById(sectionDomId(sectionId))?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }, [])

  // Which section the reader is in. Whichever observed heading is nearest the
  // top of the pane wins, so scrolling through a long section keeps pointing at
  // that section rather than flickering to whatever is half-visible below.
  useEffect(() => {
    if (!isOpen || sections.length === 0) return

    const elements = sections
      .map(section => document.getElementById(sectionDomId(section.id)))
      .filter(Boolean)

    if (elements.length === 0) return

    const observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

      if (visible.length === 0) return

      const id = visible[0].target.id.replace(SECTION_DOM_ID_PREFIX, '')
      setActiveId(Number(id))
    }, {
      // Only the band just under the pane's top edge counts as "here".
      rootMargin: '0px 0px -75% 0px',
      threshold: 0,
    })

    elements.forEach(element => observer.observe(element))
    return () => observer.disconnect()
  }, [isOpen, sections])

  return {
    isOpen,
    toggle,
    activeId,
    sensors,
    handleDragEnd,
    jumpTo,
  }
}
