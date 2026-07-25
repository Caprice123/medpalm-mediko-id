import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMcqTopics, fetchMcqSubtopicsRaw, startMcqCustomSession, actions } from '@store/mcqNodes'

export function useTopicList() {
  const dispatch = useDispatch()
  const { topics } = useSelector(s => s.mcqNodes)

  const [openIds, setOpenIds] = useState(new Set())
  const [subtopicsCache, setSubtopicsCache] = useState({})
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [searchQuery, setSearchQuery] = useState('')
  const [customOpen, setCustomOpen] = useState(false)

  useEffect(() => {
    dispatch(fetchMcqTopics())
  }, [dispatch])

  const handleCloseSession = (submitted) => {
    dispatch(actions.setSessionQuestions([]))
    if (submitted) dispatch(fetchMcqTopics())
  }

  const toggle = useCallback(async (topicId) => {
    setOpenIds(prev => {
      const next = new Set(prev)
      next.has(topicId) ? next.delete(topicId) : next.add(topicId)
      return next
    })
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

  const handleStart = (nodeIds, count) => {
    dispatch(startMcqCustomSession(nodeIds, count))
  }

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  const attempted = topics.filter(t => t.avgScore != null)
  const overallAvg = attempted.length > 0
    ? Math.round(attempted.reduce((sum, t) => sum + t.avgScore, 0) / attempted.length)
    : null

  return {
    topics,
    filteredTopics,
    openIds,
    subtopicsCache,
    loadingIds,
    searchQuery,
    setSearchQuery,
    customOpen,
    setCustomOpen,
    overallAvg,
    handleCloseSession,
    toggle,
    handleStart,
  }
}
