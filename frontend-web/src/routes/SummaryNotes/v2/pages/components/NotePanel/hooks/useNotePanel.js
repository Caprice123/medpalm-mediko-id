import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSummaryNoteDetailV2, fetchNoteAnatomyQuizRelations, fetchNoteNodeStats,
} from '@store/summaryNotes/v2/userAction'

export function useNotePanel(noteId) {
  const dispatch = useDispatch()
  const { detail } = useSelector(s => s.summaryNotesV2)

  useEffect(() => {
    if (noteId) {
      dispatch(fetchSummaryNoteDetailV2(noteId))
    }
  }, [noteId, dispatch])

  const nodeInfo = detail?.nodes?.[0] ?? null
  const nodeId = nodeInfo?.nodeId ?? null
  const topicSlug = nodeInfo?.path?.[0]?.slug ?? null
  const topicName = nodeInfo?.path?.[0]?.name ?? null
  const subtopicSlug = nodeInfo?.nodeSlug ?? null
  const subtopicName = nodeInfo?.nodeName ?? null
  const breadcrumbPath = nodeInfo?.path || []

  useEffect(() => {
    dispatch(fetchNoteNodeStats(nodeId))
  }, [nodeId, dispatch])

  // Anatomy quiz links live on the summary note itself (content_relations),
  // not on the node — matches what's editable in the admin's "Konten Terkait" tab.
  useEffect(() => {
    dispatch(fetchNoteAnatomyQuizRelations(detail?.uniqueId))
  }, [detail?.uniqueId, dispatch])

  const parsedContent = useMemo(() => {
    if (!detail?.content) return null
    try {
      return typeof detail.content === 'string' ? JSON.parse(detail.content) : detail.content
    } catch {
      return null
    }
  }, [detail?.content])

  return {
    detail,
    parsedContent,
    breadcrumbPath,
    topicSlug, topicName, subtopicSlug, subtopicName,
  }
}
