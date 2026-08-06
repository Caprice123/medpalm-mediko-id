import { useEffect, useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  fetchDiagnosticCategories,
  fetchDiagnosticSubmodulesRaw,
  fetchDiagnosticDueToday,
  fetchDiagnosticProgress,
  fetchDiagnosticProgressSubmodules,
  startDiagnosticDueSession,
  actions,
} from '@store/diagnosticNodes'

export const DUE_SESSION_BATCH_SIZE = 20

export function useCategoryList() {
  const dispatch = useDispatch()
  const { subtopicsByTopic } = useSelector(s => s.diagnosticNodes)

  const [openTopicId, setOpenTopicId] = useState(null)
  const [loadingTopicId, setLoadingTopicId] = useState(null)
  const [customOpen, setCustomOpen] = useState(false)
  const [progressSubmodulesCache, setProgressSubmodulesCache] = useState({})

  useEffect(() => {
    dispatch(fetchDiagnosticCategories())
    dispatch(fetchDiagnosticDueToday())
    dispatch(fetchDiagnosticProgress())
  }, [dispatch])

  const handleStartAllDue = () => dispatch(startDiagnosticDueSession(DUE_SESSION_BATCH_SIZE))

  const handleCloseSession = () => {
    dispatch(actions.setSessionCards([]))
    dispatch(fetchDiagnosticDueToday())
    dispatch(fetchDiagnosticProgress())
  }

  const toggle = useCallback(async (topicId) => {
    setOpenTopicId(prev => (prev === topicId ? null : topicId))
    if (!subtopicsByTopic[topicId]) {
      setLoadingTopicId(topicId)
      try {
        await dispatch(fetchDiagnosticSubmodulesRaw(topicId))
      } finally {
        setLoadingTopicId(prev => (prev === topicId ? null : prev))
      }
    }
  }, [dispatch, subtopicsByTopic])

  const loadProgressSubmodules = useCallback(async (moduleId) => {
    const data = await dispatch(fetchDiagnosticProgressSubmodules(moduleId))
    setProgressSubmodulesCache(prev => ({ ...prev, [moduleId]: data }))
  }, [dispatch])

  return {
    openTopicId,
    loadingTopicId,
    customOpen,
    setCustomOpen,
    handleStartAllDue,
    handleCloseSession,
    toggle,
    progressSubmodulesCache,
    loadProgressSubmodules,
  }
}
