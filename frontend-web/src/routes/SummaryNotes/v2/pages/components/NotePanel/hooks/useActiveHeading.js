import { useCallback, useEffect, useRef, useState } from 'react'

// Where a heading comes to rest below the top of the scroll container after a jump,
// and — give or take the tolerance — the line at which a heading becomes the one
// being read. One constant for both: when they were two unrelated numbers, clicking
// an entry could scroll to a heading and then highlight the *next* one, because a
// short section left both of them above the activation line.
const HEADING_ANCHOR = 24
const ACTIVE_TOLERANCE = 8

// BlockNote puts `data-id` on the block's outer wrapper, which carries the padding
// that spaces blocks apart — the reader adds more above headings specifically. The
// wrapper's top is therefore well above the heading text a reader actually sees, so
// measuring or scrolling to it left a gap of that padding on top of the anchor.
// Everything here works on the content element inside it instead.
function headingElement(container, headingId) {
  const wrapper = container.querySelector(`[data-id="${headingId}"]`)
  // `data-content-type` is the same contract the reader's own BlockNote styles are
  // written against, so it is the surer of the two; the class is kept as a fallback
  // and the wrapper itself as a last resort, which only costs the block's padding.
  return wrapper?.querySelector('[data-content-type], .bn-block-content') ?? wrapper ?? null
}

// Which outline entry to mark in the table of contents, and how to jump to one.
// Separate from the progress bar: that measures the container, this measures
// headings, and tangling them meant the bar's listener was rebuilt every time the
// outline changed. Takes the element rather than a ref because the reader shows a
// loading skeleton while a note is fetched: the container mounts after this hook
// first runs, and a ref object's identity never changes, so an effect keyed on one
// would attach its listener to nothing and never re-run.
export function useActiveHeading(scrollElement, outline) {
  const [activeHeadingId, setActiveHeadingId] = useState(null)
  const frameRef = useRef(null)

  const measure = useCallback(() => {
    if (!scrollElement || outline.length === 0) {
      setActiveHeadingId(null)
      return
    }
    const containerTop = scrollElement.getBoundingClientRect().top
    const threshold = HEADING_ANCHOR + ACTIVE_TOLERANCE
    // The last heading at or above the line wins; headings scrolled off the top have
    // a negative offset, so there is always a match once the first one is passed.
    let current = outline[0].id
    for (const heading of outline) {
      const element = headingElement(scrollElement, heading.id)
      if (!element) continue
      if (element.getBoundingClientRect().top - containerTop <= threshold) {
        current = heading.id
      } else {
        break
      }
    }
    setActiveHeadingId(current)
  }, [scrollElement, outline])

  useEffect(() => {
    if (!scrollElement) return

    const handleScroll = () => {
      if (frameRef.current !== null) return
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = null
        measure()
      })
    }

    scrollElement.addEventListener('scroll', handleScroll, { passive: true })
    // Images and embeds settling changes every heading's position.
    const observer = new ResizeObserver(handleScroll)
    observer.observe(scrollElement)
    measure()

    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
      observer.disconnect()
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current)
      frameRef.current = null
    }
  }, [scrollElement, measure])

  const scrollToHeading = useCallback((headingId) => {
    if (!scrollElement) return
    const element = headingElement(scrollElement, headingId)
    if (!element) return
    const offset = element.getBoundingClientRect().top - scrollElement.getBoundingClientRect().top
    scrollElement.scrollTo({
      top: scrollElement.scrollTop + offset - HEADING_ANCHOR,
      behavior: 'smooth',
    })
  }, [scrollElement])

  return { activeHeadingId, scrollToHeading }
}
