import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchFlashcardTopics,
  fetchFlashcardSubtopicsRaw,
  fetchFlashcardDueToday,
  fetchFlashcardProgress,
  startFlashcardDueSession,
  actions,
} from '@store/flashcardNodes'

export function useTopicList() {
  const dispatch = useDispatch()
  const { topics, sessionCards, progress } = useSelector(s => s.flashcardNodes)

  const [openIds, setOpenIds] = useState(new Set())
  const [subtopicsCache, setSubtopicsCache] = useState({})
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [customOpen, setCustomOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchFlashcardTopics())
    dispatch(fetchFlashcardDueToday())
    dispatch(fetchFlashcardProgress())
  }, [dispatch])

  const handleStartAllDue = () => dispatch(startFlashcardDueSession(null))

  const handleCloseSession = () => {
    dispatch(actions.setSessionCards([]))
    dispatch(fetchFlashcardDueToday())
    dispatch(fetchFlashcardProgress())
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
        const data = await dispatch(fetchFlashcardSubtopicsRaw(topicId))
        setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
      } finally {
        setLoadingIds(prev => { const n = new Set(prev); n.delete(topicId); return n })
      }
    }
  }, [dispatch, subtopicsCache])

  const statsMap = new Map((progress?.topics || []).map(t => [t.nodeId, t]))

  const filteredTopics = searchQuery.trim()
    ? topics.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : topics

  return {
    topics,
    openIds,
    subtopicsCache,
    loadingIds,
    customOpen,
    setCustomOpen,
    searchQuery,
    setSearchQuery,
    handleStartAllDue,
    handleCloseSession,
    toggle,
    statsMap,
    filteredTopics,
  }
}
