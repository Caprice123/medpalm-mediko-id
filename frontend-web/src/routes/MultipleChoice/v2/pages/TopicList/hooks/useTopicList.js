import { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import {
  fetchMcqTopics, fetchMcqSubtopicsRaw, loadMoreMcqSubtopicsRaw, fetchAllMcqSubtopicsRaw,
  startMcqCustomSession, actions,
} from '@store/mcqNodes'
import { fetchUserNodeByName } from '@store/featureNodes'

export function useTopicList() {
  const dispatch = useDispatch()
  const { topics } = useSelector(s => s.mcqNodes)
  const [searchParams] = useSearchParams()
  const deepLinkSubtopicName = searchParams.get('subtopic')
  const [resolvedDeepLinkSubtopicId, setResolvedDeepLinkSubtopicId] = useState(null)
  const consumedDeepLinkRef = useRef(false)

  const [openId, setOpenId] = useState(null)
  const [subtopicsCache, setSubtopicsCache] = useState({})
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [customOpen, setCustomOpen] = useState(false)
  // where the running session is rendered: { type: 'topic', topicId } | { type: 'custom' }
  const [sessionOrigin, setSessionOrigin] = useState(null)

  useEffect(() => {
    dispatch(fetchMcqTopics())
  }, [dispatch])

  // deep link — e.g. /multiple-choice?subtopic=Aritmia from a related-content link.
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

  const handleCloseSession = useCallback((submitted) => {
    setSessionOrigin(null)
    dispatch(actions.setSessionQuestions([]))
    if (submitted) dispatch(fetchMcqTopics())
  }, [dispatch])

  const toggle = useCallback(async (topicId) => {
    const collapsing = openId === topicId
    setOpenId(collapsing ? null : topicId)
    // collapsing the topic that hosts the session ends it, so it can't be
    // resumed half-way with the session's own state already thrown away
    if (collapsing) {
      if (sessionOrigin?.type === 'topic' && sessionOrigin.topicId === topicId) handleCloseSession(false)
      return
    }
    if (!subtopicsCache[topicId]) {
      setLoadingIds(prev => new Set(prev).add(topicId))
      try {
        const data = await dispatch(fetchMcqSubtopicsRaw(topicId))
        setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
      } finally {
        setLoadingIds(prev => { const n = new Set(prev); n.delete(topicId); return n })
      }
    }
  }, [dispatch, subtopicsCache, openId, sessionOrigin, handleCloseSession])

  // Used by the performance chart drill-down — needs the complete set, not just page 1.
  const loadSubtopics = useCallback(async (topicId) => {
    const data = await dispatch(fetchAllMcqSubtopicsRaw(topicId))
    setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
  }, [dispatch])

  const loadMoreSubtopics = useCallback(async (topicId) => {
    const entry = subtopicsCache[topicId]
    if (!entry?.nextCursor) return
    const data = await dispatch(loadMoreMcqSubtopicsRaw(topicId, entry.nextCursor))
    setSubtopicsCache(prev => ({
      ...prev,
      [topicId]: { items: [...(prev[topicId]?.items || []), ...data.items], nextCursor: data.nextCursor },
    }))
  }, [dispatch, subtopicsCache])

  const handleStart = (topicId, nodeIds, count) => {
    setSessionOrigin({ type: 'topic', topicId })
    dispatch(startMcqCustomSession(nodeIds, count))
  }

  const handleCustomSessionStarted = () => setSessionOrigin({ type: 'custom' })

  return {
    openId,
    subtopicsCache,
    loadingIds,
    customOpen,
    setCustomOpen,
    sessionOrigin,
    handleCloseSession,
    toggle,
    handleStart,
    handleCustomSessionStarted,
    loadSubtopics,
    loadMoreSubtopics,
    deepLinkSubtopicId: resolvedDeepLinkSubtopicId,
  }
}
