import { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchMcqSubtopicsRaw, startMcqCustomSession } from '@store/mcqNodes'

export function useCustomSession(onClose) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.mcqNodes)

  const [sectionList, setSectionList] = useState([{ id: 1, topicId: null, subtopicIds: [], count: 5 }])
  const [subtopicsMap, setSubtopicsMap] = useState({})
  const subtopicsMapRef = useRef({})
  const loadingRef = useRef(new Set())
  const [loadingTopics, setLoadingTopics] = useState(new Set())

  const loadSubtopics = useCallback(async (topicId) => {
    if (subtopicsMapRef.current[topicId] !== undefined || loadingRef.current.has(topicId)) return
    loadingRef.current.add(topicId)
    setLoadingTopics(new Set(loadingRef.current))
    try {
      const data = await dispatch(fetchMcqSubtopicsRaw(topicId))
      subtopicsMapRef.current[topicId] = data
      setSubtopicsMap({ ...subtopicsMapRef.current })
    } finally {
      loadingRef.current.delete(topicId)
      setLoadingTopics(new Set(loadingRef.current))
    }
  }, [dispatch])

  const updateSection = (id, updates) => {
    setSectionList(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
    if (updates.topicId) loadSubtopics(updates.topicId)
  }

  const addSection = () =>
    setSectionList(prev => [...prev, { id: Date.now(), topicId: null, subtopicIds: [], count: 5 }])

  const removeSection = (id) =>
    setSectionList(prev => prev.filter(d => d.id !== id))

  const totalCount = sectionList.reduce((sum, d) => sum + d.count, 0)

  const handleStart = () => {
    const nodeIds = []
    for (const d of sectionList) {
      if (!d.topicId) continue
      const subs = subtopicsMapRef.current[d.topicId] || []
      if (d.subtopicIds.length === 0) nodeIds.push(...subs.map(s => s.id))
      else nodeIds.push(...d.subtopicIds)
    }
    if (nodeIds.length === 0) return
    dispatch(startMcqCustomSession(nodeIds, totalCount))
    onClose()
  }

  const canStart = sectionList.some(d => d.topicId !== null) && !loading.isStartingSession

  return {
    sectionList,
    subtopicsMap,
    loadingTopics,
    updateSection,
    addSection,
    removeSection,
    totalCount,
    handleStart,
    canStart,
    loading,
  }
}
