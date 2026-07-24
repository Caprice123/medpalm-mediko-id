import { useState, useRef, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchFlashcardSubtopicsRaw, startFlashcardCustomSession } from '@store/flashcardNodes'

export function useCustomSession(onClose) {
  const dispatch = useDispatch()
  const { loading } = useSelector(s => s.flashcardNodes)

  const [departmentList, setDepartmentList] = useState([{ id: 1, topicId: null, subtopicId: null, count: 5 }])
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

  const updateDepartment = (id, updates) => {
    setDepartmentList(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d))
    if (updates.topicId) loadSubtopics(updates.topicId)
  }

  const addDepartment = () =>
    setDepartmentList(prev => [...prev, { id: Date.now(), topicId: null, subtopicId: null, count: 5 }])

  const removeDepartment = (id) =>
    setDepartmentList(prev => prev.filter(d => d.id !== id))

  const totalCount = departmentList.reduce((sum, d) => sum + d.count, 0)

  const handleStart = () => {
    const nodeIds = []
    for (const d of departmentList) {
      if (!d.topicId) continue
      const subs = subtopicsMapRef.current[d.topicId] || []
      if (d.subtopicId === null) nodeIds.push(...subs.map(s => s.id))
      else nodeIds.push(d.subtopicId)
    }
    if (nodeIds.length === 0) return
    dispatch(startFlashcardCustomSession(nodeIds, totalCount, onClose))
  }

  const canStart = departmentList.some(d => d.topicId !== null) && !loading.isStartingSession

  return {
    departmentList,
    subtopicsMap,
    loadingTopics,
    updateDepartment,
    addDepartment,
    removeDepartment,
    totalCount,
    handleStart,
    canStart,
  }
}
