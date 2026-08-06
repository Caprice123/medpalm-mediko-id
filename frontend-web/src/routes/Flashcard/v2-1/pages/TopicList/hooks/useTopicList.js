import { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  fetchFlashcardTopics,
  fetchFlashcardSubtopicsRaw,
  fetchFlashcardDueToday,
  fetchFlashcardProgress,
  fetchFlashcardProgressSubtopics,
  startFlashcardDueSession,
  actions,
} from '@store/flashcardNodes'
import { fetchUserNodeByName } from '@store/featureNodes'

export const DUE_SESSION_BATCH_SIZE = 20

export function useTopicList() {
  const dispatch = useDispatch()
  const { topics, subtopicsByTopic } = useSelector(s => s.flashcardNodes)
  const [searchParams] = useSearchParams()
  const deepLinkSubtopicName = searchParams.get('subtopic')
  const [resolvedDeepLinkSubtopicId, setResolvedDeepLinkSubtopicId] = useState(null)
  const consumedDeepLinkRef = useRef(false)

  const [openTopicId, setOpenTopicId] = useState(null)
  const [loadingTopicId, setLoadingTopicId] = useState(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [progressSubtopicsCache, setProgressSubtopicsCache] = useState({})

  useEffect(() => {
    dispatch(fetchFlashcardTopics())
    dispatch(fetchFlashcardDueToday())
    dispatch(fetchFlashcardProgress())
  }, [dispatch])

  // deep link — e.g. /flashcards?subtopic=Aritmia from a related-content link.
  // Resolve the subtopic's parent topic so we know which one to auto-expand.
  useEffect(() => {
    if (consumedDeepLinkRef.current || !deepLinkSubtopicName || topics.length === 0) return
    consumedDeepLinkRef.current = true
    dispatch(fetchUserNodeByName(deepLinkSubtopicName)).then(node => {
      if (node?.parentId && topics.some(t => t.id === node.parentId)) {
        setResolvedDeepLinkSubtopicId(node.id)
        toggle(node.parentId)
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deepLinkSubtopicName, topics])

  const handleStartAllDue = () => dispatch(startFlashcardDueSession(DUE_SESSION_BATCH_SIZE))

  const handleCloseSession = () => {
    dispatch(actions.setSessionCards([]))
    dispatch(fetchFlashcardDueToday())
    dispatch(fetchFlashcardProgress())
  }

  const toggle = useCallback(async (topicId) => {
    setOpenTopicId(prev => (prev === topicId ? null : topicId))
    if (!subtopicsByTopic[topicId]) {
      setLoadingTopicId(topicId)
      try {
        await dispatch(fetchFlashcardSubtopicsRaw(topicId))
      } finally {
        setLoadingTopicId(prev => (prev === topicId ? null : prev))
      }
    }
  }, [dispatch, subtopicsByTopic])

  const loadProgressSubtopics = useCallback(async (topicId) => {
    const data = await dispatch(fetchFlashcardProgressSubtopics(topicId))
    setProgressSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
  }, [dispatch])

  return {
    openTopicId,
    loadingTopicId,
    customOpen,
    setCustomOpen,
    handleStartAllDue,
    handleCloseSession,
    toggle,
    deepLinkSubtopicId: resolvedDeepLinkSubtopicId,
    progressSubtopicsCache,
    loadProgressSubtopics,
  }
}
