import { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchSummaryNoteDetailV2, fetchNoteAnatomyQuizRelations, fetchNoteNodeStats,
} from '@store/summaryNotes/v2/userAction'
import { extractOutline, estimateReadingMinutes } from '../../../utils/noteOutline'

export function useNotePanel(noteId) {
  const dispatch = useDispatch()
  const detail = useSelector(s => s.summaryNotesV2.detail)

  useEffect(() => {
    if (noteId) {
      dispatch(fetchSummaryNoteDetailV2(noteId))
    }
  }, [noteId, dispatch])

  const nodeInfo = detail?.nodes?.[0] ?? null
  const nodeId = nodeInfo?.nodeId ?? null
  const topicNode = nodeInfo?.path?.[0] ?? null

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

  const outline = useMemo(() => extractOutline(parsedContent), [parsedContent])
  const readingMinutes = useMemo(() => estimateReadingMinutes(parsedContent), [parsedContent])

  return {
    detail,
    parsedContent,
    outline,
    readingMinutes,
    // The breadcrumb stops at the subtopic: the note's own title is the <h1> directly
    // below it, and repeating it as the last crumb said the same thing twice.
    breadcrumbPath: nodeInfo?.path || [],
    topicSlug: topicNode?.slug ?? null,
    topicName: topicNode?.name ?? null,
    topicNodeId: topicNode?.id ?? null,
    subtopicSlug: nodeInfo?.nodeSlug ?? null,
    subtopicName: nodeInfo?.nodeName ?? null,
    subtopicNodeId: nodeId,
  }
}
