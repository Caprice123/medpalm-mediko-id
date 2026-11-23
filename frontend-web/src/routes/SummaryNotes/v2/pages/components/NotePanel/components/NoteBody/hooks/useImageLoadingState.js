import { useEffect } from 'react'

// Marks every figure in the note as loading until its bytes arrive, so the stylesheet can show a
// placeholder in the space the picture will occupy.
//
// Images used to travel inside the note's own JSON as base64, so they painted together with the
// text and never needed a placeholder — the cost was paid up front, in a 17 MB response that
// took thirteen seconds before a single paragraph appeared. They are blob URLs now: the text
// arrives on its own and each figure is a separate request behind it. That is far faster to
// first paragraph, but it leaves gaps where the figures will be, and a gap reads as a broken
// page rather than as one still filling in.
//
// Done from the outside rather than in a component because BlockNote renders the `<img>`
// elements itself — the reader never holds them, so it cannot give them a loading state of their
// own without replacing BlockNote's image block.
export function useImageLoadingState(containerRef) {
  useEffect(() => {
    const root = containerRef.current
    if (!root) return

    const pending = new Set()

    const track = (image) => {
      // Marking an image twice would re-arm a placeholder on a picture that has already
      // arrived, and the second `load` never comes to clear it.
      if (image.dataset.loadingTracked) return
      image.dataset.loadingTracked = 'true'

      // Already decoded — a cached figure, or one that beat this effect. `naturalWidth` is the
      // part that separates a finished image from a failed one, which is also `complete`.
      if (image.complete && image.naturalWidth > 0) return

      image.dataset.loading = 'true'

      const settle = () => {
        delete image.dataset.loading
        image.removeEventListener('load', settle)
        image.removeEventListener('error', settle)
        pending.delete(settle)
      }

      // `error` clears the placeholder too: a figure whose request failed should stop shimmering
      // and show as a broken image, instead of claiming forever that it is still on its way.
      image.addEventListener('load', settle)
      image.addEventListener('error', settle)
      pending.add(settle)
    }

    const scan = () => root.querySelectorAll('img').forEach(track)

    scan()

    // BlockNote mounts its blocks after this effect runs, and remounts them as the reader moves
    // through the document, so a single scan would catch almost none of the figures.
    const observer = new MutationObserver(scan)
    observer.observe(root, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      pending.forEach((settle) => settle())
    }
  }, [containerRef])
}
