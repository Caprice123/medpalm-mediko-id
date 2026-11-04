import { useEffect, useRef } from 'react'

export function useTreeNode({ isSelected, canLoadMore, nodeId, onLoadMoreChildren }) {
  const rowRef = useRef(null)
  const loadMoreRef = useRef(null)

  // Keep the open note's row visible. A note can become selected without being
  // clicked — a direct /summary-notes/:id URL, the back button, a search hit, a
  // previous/next jump in the reader — and in all of those the tree expands to a row
  // that may sit outside the scrolled viewport. `nearest` so an already-visible row
  // is left exactly where it is.
  useEffect(() => {
    if (!isSelected) return
    rowRef.current?.scrollIntoView({ block: 'nearest' })
  }, [isSelected])

  useEffect(() => {
    if (!canLoadMore) return
    const element = loadMoreRef.current
    if (!element) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) onLoadMoreChildren(nodeId) },
      { rootMargin: '200px' },
    )
    observer.observe(element)
    return () => observer.disconnect()
  }, [canLoadMore, nodeId, onLoadMoreChildren])

  return { rowRef, loadMoreRef }
}
