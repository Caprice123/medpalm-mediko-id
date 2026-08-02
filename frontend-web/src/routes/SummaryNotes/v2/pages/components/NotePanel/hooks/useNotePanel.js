import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSummaryNoteDetailV2, fetchNoteAnatomyQuizRelations } from '@store/summaryNotes/v2/userAction'
import { fetchNodeStats } from '@store/featureNodes'
import { fetchPublicConstants } from '@store/constant/userAction'

export function useNotePanel(noteId) {
  const dispatch = useDispatch()
  const { detail, loading } = useSelector(s => s.summaryNotesV2)
  const constants = useSelector(s => s.constant.constants)

  const [nodeStats, setNodeStats] = useState(null)
  const [anatomyQuizzes, setAnatomyQuizzes] = useState([])

  useEffect(() => {
    dispatch(fetchPublicConstants(['flashcard_feature_title', 'mcq_feature_title']))
  }, [dispatch])

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
    if (!nodeId) {
      setNodeStats(null)
      return
    }
    dispatch(fetchNodeStats(nodeId)).then(setNodeStats)
  }, [nodeId, dispatch])

  // Anatomy quiz links live on the summary note itself (content_relations),
  // not on the node — matches what's editable in the admin's "Konten Terkait" tab.
  useEffect(() => {
    if (!detail?.uniqueId) {
      setAnatomyQuizzes([])
      return
    }
    dispatch(fetchNoteAnatomyQuizRelations(detail.uniqueId)).then(setAnatomyQuizzes)
  }, [detail?.uniqueId, dispatch])

  const parsedContent = useMemo(() => {
    if (!detail?.content) return null
    try {
      return typeof detail.content === 'string' ? JSON.parse(detail.content) : detail.content
    } catch {
      return null
    }
  }, [detail?.content])

  const flashcardLabel = constants?.flashcard_feature_title || 'Flashcard'
  const mcqLabel = constants?.mcq_feature_title || 'MCQ'

  const hasTopic = !!topicName
  const hasFlashcards = (nodeStats?.flashcardCards ?? 0) > 0
  const hasMcq = (nodeStats?.mcqQuestions ?? 0) > 0
  const hasAnatomyQuizzes = anatomyQuizzes.length > 0
  const hasLinkedResources = hasTopic || hasFlashcards || hasMcq || hasAnatomyQuizzes

  return {
    detail,
    isLoading: loading.isNoteDetailLoading,
    parsedContent,
    breadcrumbPath,
    topicSlug, topicName, subtopicSlug, subtopicName,
    nodeStats, anatomyQuizzes,
    flashcardLabel, mcqLabel,
    hasTopic, hasFlashcards, hasMcq, hasAnatomyQuizzes, hasLinkedResources,
  }
}
