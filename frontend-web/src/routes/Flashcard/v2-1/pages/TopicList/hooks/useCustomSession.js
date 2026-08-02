import { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlashcardSubtopicsRaw, startFlashcardCustomSession } from '@store/flashcardNodes'

export function useCustomSession(onClose) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.flashcardNodes)

  const [topicFilters, setTopicFilters] = useState([{ id: 1, topicId: null, subtopicIds: [], count: 5 }])
  const [subtopicsMap, setSubtopicsMap] = useState({})
  const subtopicsMapRef = useRef({})
  const loadingRef = useRef(new Set())
  const [loadingTopics, setLoadingTopics] = useState(new Set())

  const loadSubtopics = useCallback(async (topicId) => {
    if (subtopicsMapRef.current[topicId] !== undefined || loadingRef.current.has(topicId)) return
    loadingRef.current.add(topicId)
    setLoadingTopics(new Set(loadingRef.current))
    try {
      const data = await dispatch(fetchFlashcardSubtopicsRaw(topicId))
      subtopicsMapRef.current[topicId] = data
      setSubtopicsMap({ ...subtopicsMapRef.current })
    } finally {
      loadingRef.current.delete(topicId)
      setLoadingTopics(new Set(loadingRef.current))
    }
  }, [dispatch])

  const updateTopicFilter = (id, updates) => {
    setTopicFilters(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f))
    if (updates.topicId) loadSubtopics(updates.topicId)
  }

  const addTopicFilter = () =>
    setTopicFilters(prev => [...prev, { id: Date.now(), topicId: null, subtopicIds: [], count: 5 }])

  const removeTopicFilter = (id) =>
    setTopicFilters(prev => prev.filter(f => f.id !== id))

  const totalCount = topicFilters.reduce((sum, f) => sum + f.count, 0)

  const handleStart = () => {
    const nodeIds = []
    for (const f of topicFilters) {
      if (!f.topicId) continue
      const subs = subtopicsMapRef.current[f.topicId] || []
      if (f.subtopicIds.length === 0) nodeIds.push(...subs.map(s => s.id))
      else nodeIds.push(...f.subtopicIds)
    }
    if (nodeIds.length === 0) return
    dispatch(startFlashcardCustomSession(nodeIds, totalCount, onClose))
  }

  const canStart = topicFilters.some(f => f.topicId !== null) && !loading.isStartingSession

  return {
    topicFilters,
    subtopicsMap,
    loadingTopics,
    updateTopicFilter,
    addTopicFilter,
    removeTopicFilter,
    totalCount,
    handleStart,
    canStart,
  }
}
