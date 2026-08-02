import { useEffect, useState, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { fetchMcqTopics, fetchMcqSubtopicsRaw, startMcqCustomSession, actions } from '@store/mcqNodes'
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

  const handleCloseSession = (submitted) => {
    dispatch(actions.setSessionQuestions([]))
    if (submitted) dispatch(fetchMcqTopics())
  }

  const toggle = useCallback(async (topicId) => {
    setOpenId(prev => prev === topicId ? null : topicId)
    if (!subtopicsCache[topicId]) {
      setLoadingIds(prev => new Set(prev).add(topicId))
      try {
        const data = await dispatch(fetchMcqSubtopicsRaw(topicId))
        setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
      } finally {
        setLoadingIds(prev => { const n = new Set(prev); n.delete(topicId); return n })
      }
    }
  }, [dispatch, subtopicsCache])

  const loadSubtopics = useCallback(async (topicId) => {
    const data = await dispatch(fetchMcqSubtopicsRaw(topicId))
    setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
  }, [dispatch])

  const handleStart = (nodeIds, count) => {
    dispatch(startMcqCustomSession(nodeIds, count))
  }

  return {
    openId,
    subtopicsCache,
    loadingIds,
    customOpen,
    setCustomOpen,
    handleCloseSession,
    toggle,
    handleStart,
    loadSubtopics,
    deepLinkSubtopicId: resolvedDeepLinkSubtopicId,
  }
}
