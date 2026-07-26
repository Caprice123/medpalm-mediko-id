import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMcqTopics, fetchMcqSubtopicsRaw, startMcqCustomSession, actions } from '@store/mcqNodes'

export function useTopicList() {
  const dispatch = useDispatch()
  const { topics } = useSelector(s => s.mcqNodes)
const [openId, setOpenId] = useState(null)
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

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  return {
    topics,
    filteredTopics,
    openId,
    subtopicsCache,
    loadingIds,
    searchQuery,
    setSearchQuery,
    customOpen,
    setCustomOpen,
    handleCloseSession,
    toggle,
    handleStart,
    loadSubtopics,
  }
}
