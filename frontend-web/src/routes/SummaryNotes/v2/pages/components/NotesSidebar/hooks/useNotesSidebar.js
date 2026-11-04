import { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSummaryNotesByNode, fetchUserNodeChildren, loadMoreUserNodeChildren,
  fetchSummaryNoteTopics,
} from '@store/summaryNotes/v2/userAction'
import { fetchFavorites } from '@store/favorites/userAction'

export function useNotesSidebar({ onSelectNote, onSelectEmptyNode }) {
  const dispatch = useDispatch()
  const { nodeNotes, nodeChildren, detail } = useSelector(s => s.summaryNotesV2)

  // Which disclosures the reader has opened — pure presentation, and deliberately
  // not persisted: a reader returning to the page wants to see the note they were
  // reading revealed, not whatever twelve topics they once expanded.
  const [expandedNodes, setExpandedNodes] = useState(new Set())

  useEffect(() => {
    dispatch(fetchSummaryNoteTopics())
    dispatch(fetchFavorites('summary_note'))
  }, [dispatch])

  const fetchChildren = useCallback(async (nodeId) => {
    if (nodeId in nodeChildren) return nodeChildren[nodeId]
    return dispatch(fetchUserNodeChildren(nodeId))
  }, [nodeChildren, dispatch])

  const fetchNotesUntilFound = useCallback(async (nodeId, noteId) => {
    const existing = nodeNotes[nodeId]
    if (existing?.notes?.find(note => note.id === noteId)) return
    let page = existing?.isLoaded ? existing.page + 1 : 1
    for (;;) {
      const result = await dispatch(fetchSummaryNotesByNode(nodeId, page))
      if (!result || result.notes.find(note => note.id === noteId) || result.isLastPage) break
      page++
    }
  }, [nodeNotes, dispatch])

  // Expand the ancestors of whichever note is now open so the tree always shows
  // where the reader is. Driven off `detail` rather than off click handlers, so it
  // also fires for a note reached by a direct /summary-notes/:id URL or by the
  // browser's back button — neither of which goes through a click. Idempotent:
  // ancestors already loaded are not refetched.
  useEffect(() => {
    const path = detail?.nodes?.[0]?.path
    if (!path?.length) return

    let cancelled = false
    const reveal = async () => {
      for (const ancestor of path.slice(0, -1)) {
        if (cancelled) return
        await fetchChildren(ancestor.id)
        setExpandedNodes(prev => new Set([...prev, ancestor.id]))
      }
      if (cancelled) return
      const leaf = path[path.length - 1]
      await fetchNotesUntilFound(leaf.id, detail.id)
    }
    reveal()
    return () => { cancelled = true }
    // Keyed on the note itself: re-running on every nodeChildren change would loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [detail?.id])

  // A subtopic (layer 2) is always a leaf bound to at most one note — a convention
  // used app-wide — so clicking one opens its note directly rather than expanding.
  const openLeafNode = useCallback(async (node) => {
    let nodeData = nodeNotes[node.id]
    if (!nodeData?.isLoaded) {
      const result = await dispatch(fetchSummaryNotesByNode(node.id))
      nodeData = { notes: result?.notes || [] }
    }
    if (nodeData.notes?.length > 0) {
      onSelectNote(nodeData.notes[0].uniqueId)
    } else {
      onSelectEmptyNode(node.id)
    }
  }, [nodeNotes, dispatch, onSelectNote, onSelectEmptyNode])

  const handleToggleNode = useCallback(async (node) => {
    if (node.layer !== 1) {
      await openLeafNode(node)
      return
    }
    if (expandedNodes.has(node.id)) {
      setExpandedNodes(prev => {
        const next = new Set(prev)
        next.delete(node.id)
        return next
      })
      return
    }
    setExpandedNodes(prev => new Set([...prev, node.id]))
    await fetchChildren(node.id)
  }, [expandedNodes, fetchChildren, openLeafNode])

  const handleLoadMoreChildren = useCallback((nodeId) => {
    dispatch(loadMoreUserNodeChildren(nodeId))
  }, [dispatch])

  return { expandedNodes, handleToggleNode, handleLoadMoreChildren }
}
