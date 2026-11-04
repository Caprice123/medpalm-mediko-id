import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNotesByNode, fetchUserNodeChildren } from '@store/summaryNotes/v2/userAction'

// Previous/next steps through the subtopics of the note's own topic, in the same
// order the sidebar lists them. Those children are already in the store once a topic
// has been expanded; when a reader arrives by direct URL they have not been fetched
// yet, so this fetches them itself rather than requiring the sidebar to be touched
// first. Every subtopic the endpoint returns is guaranteed to have a note (the
// backend filters on node_statistics), so a neighbour is always openable.
export function useSiblingNavigation({ topicNodeId, subtopicNodeId, onSelectNote }) {
  const dispatch = useDispatch()
  const siblings = useSelector(s => (topicNodeId ? s.summaryNotesV2.nodeChildren[topicNodeId] : null))
  const nodeNotes = useSelector(s => s.summaryNotesV2.nodeNotes)

  useEffect(() => {
    if (!topicNodeId || siblings) return
    dispatch(fetchUserNodeChildren(topicNodeId))
  }, [topicNodeId, siblings, dispatch])

  const index = Array.isArray(siblings)
    ? siblings.findIndex(node => node.id === subtopicNodeId)
    : -1
  const previous = index > 0 ? siblings[index - 1] : null
  const next = index >= 0 && index < (siblings?.length ?? 0) - 1 ? siblings[index + 1] : null

  const goToSibling = useCallback(async (node) => {
    if (!node) return
    const cached = nodeNotes[node.id]
    const notes = cached?.isLoaded
      ? cached.notes
      : (await dispatch(fetchSummaryNotesByNode(node.id)))?.notes
    if (notes?.length > 0) onSelectNote(notes[0].uniqueId)
  }, [nodeNotes, dispatch, onSelectNote])

  const isLoadingSibling = [previous, next].some(node => node && nodeNotes[node.id]?.isLoading)

  return { previous, next, goToSibling, isLoadingSibling }
}
