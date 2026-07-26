import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setPrimaryTopics, setSpecialTopics, setSessionCards, setDueToday, setProgress, setLoading } = actions

export const fetchDiagnosticSubtopicsRaw = (topicId) => async () => {
  const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/topics/${topicId}/subtopics`)
  return res.data.data || []
}

export const fetchDiagnosticCategories = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingCategories: true }))
    const [primaryRes, specialRes] = await Promise.all([
      getWithToken(`${Endpoints.api.diagnosticNodes}/categories`, { classification: 'primary' }),
      getWithToken(`${Endpoints.api.diagnosticNodes}/categories`, { classification: 'special' }),
    ])
    dispatch(setPrimaryTopics(primaryRes.data.data || []))
    dispatch(setSpecialTopics(specialRes.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingCategories: false }))
  }
}

export const startDiagnosticNodeSession = (nodeId, count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.diagnosticNodes}/session`, { nodeId, count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const startDiagnosticCustomSession = (nodeIds, count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.diagnosticNodes}/custom-session`, { nodeIds, count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const startDiagnosticDueSession = (count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.diagnosticNodes}/due-session`, { count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const startDiagnosticNodeDueSession = (nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.diagnosticNodes}/node-due-session`, { nodeId })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const fetchDiagnosticDueToday = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingDueToday: true }))
    const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/due-today`)
    dispatch(setDueToday(res.data.data || null))
  } finally {
    dispatch(setLoading({ isFetchingDueToday: false }))
  }
}

export const fetchDiagnosticProgress = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingProgress: true }))
    const [summaryRes, topicsRes] = await Promise.all([
      getWithToken(`${Endpoints.api.diagnosticNodes}/progress/summary`),
      getWithToken(`${Endpoints.api.diagnosticNodes}/progress/topics`),
    ])
    const totalCounts = summaryRes.data.data || { again: 0, hard: 0, good: 0, easy: 0 }
    const topics = topicsRes.data.data?.topics || []
    const totalQuestions = topics.reduce((sum, t) => sum + (t.totalQuestions ?? 0), 0)
    dispatch(setProgress({ totalQuestions, totalCounts, topics }))
  } finally {
    dispatch(setLoading({ isFetchingProgress: false }))
  }
}

export const submitDiagnosticRating = (recordId, rating) => async (dispatch) => {
  try {
    dispatch(setLoading({ isSubmittingRating: true }))
    await postWithToken(`${Endpoints.api.diagnosticNodes}/rate`, { recordId, rating })
  } finally {
    dispatch(setLoading({ isSubmittingRating: false }))
  }
}
