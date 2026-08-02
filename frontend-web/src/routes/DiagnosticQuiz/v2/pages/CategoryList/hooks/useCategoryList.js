import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDiagnosticCategories,
  fetchDiagnosticSubmodulesRaw,
  fetchDiagnosticDueToday,
  fetchDiagnosticProgress,
  startDiagnosticDueSession,
  actions,
} from '@store/diagnosticNodes'

export function useCategoryList() {
  const dispatch = useDispatch()
  const { primaryTopics, specialTopics, progress } = useSelector(s => s.diagnosticNodes)

  const [openIds, setOpenIds] = useState(new Set())
  const [subtopicsCache, setSubtopicsCache] = useState({})
  const [loadingIds, setLoadingIds] = useState(new Set())
  const [customOpen, setCustomOpen] = useState(false)
  const [primarySearch, setPrimarySearch] = useState('')
  const [specialSearch, setSpecialSearch] = useState('')

  useEffect(() => {
    dispatch(fetchDiagnosticCategories())
    dispatch(fetchDiagnosticDueToday())
    dispatch(fetchDiagnosticProgress())
  }, [dispatch])

  const handleStartAllDue = () => dispatch(startDiagnosticDueSession(null))

  const handleCloseSession = () => {
    dispatch(actions.setSessionCards([]))
    dispatch(fetchDiagnosticDueToday())
    dispatch(fetchDiagnosticProgress())
  }

  const toggle = useCallback(async (topicId) => {
    setOpenIds(prev => {
      if (prev.has(topicId)) return new Set()
      return new Set([topicId])
    })
    if (!subtopicsCache[topicId]) {
      setLoadingIds(prev => new Set(prev).add(topicId))
      try {
        const data = await dispatch(fetchDiagnosticSubmodulesRaw(topicId))
        setSubtopicsCache(prev => ({ ...prev, [topicId]: data }))
      } finally {
        setLoadingIds(prev => { const n = new Set(prev); n.delete(topicId); return n })
      }
    }
  }, [dispatch, subtopicsCache])

  const statsMap = new Map((progress?.topics || []).map(t => [t.nodeId, t]))

  const allTopics = [...primaryTopics, ...specialTopics]

  const filteredPrimary = primarySearch.trim()
    ? primaryTopics.filter(t => t.name.toLowerCase().includes(primarySearch.toLowerCase()))
    : primaryTopics

  const filteredSpecial = specialSearch.trim()
    ? specialTopics.filter(t => t.name.toLowerCase().includes(specialSearch.toLowerCase()))
    : specialTopics

  return {
    primaryTopics,
    specialTopics,
    filteredPrimary,
    filteredSpecial,
    openIds,
    subtopicsCache,
    loadingIds,
    customOpen,
    setCustomOpen,
    primarySearch,
    setPrimarySearch,
    specialSearch,
    setSpecialSearch,
    handleStartAllDue,
    handleCloseSession,
    toggle,
    statsMap,
    allTopics,
  }
}
