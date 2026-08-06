import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setPrimaryTopics, setSpecialTopics, setSubtopicsForTopic, appendSubtopicsForTopic, setSessionCards, setDueToday, setProgress, setLoading } = actions

const SUBMODULE_PAGE_LIMIT = 50

// Fetches only the first page — the dropdown that displays these loads more itself on scroll.
export const fetchDiagnosticSubmodulesRaw = (moduleId) => async (dispatch, getState) => {
  const cached = getState().diagnosticNodes.subtopicsByTopic[moduleId]
  if (cached) return cached.items

  const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/modules/${moduleId}/submodules`, { limit: SUBMODULE_PAGE_LIMIT })
  const subtopics = res.data.data?.submodules || []
  const nextCursor = res.data.data?.nextCursor ?? null
  dispatch(setSubtopicsForTopic({ topicId: moduleId, subtopics, nextCursor }))
  return subtopics
}

export const loadMoreDiagnosticSubmodules = (moduleId) => async (dispatch, getState) => {
  const entry = getState().diagnosticNodes.subtopicsByTopic[moduleId]
  if (!entry?.nextCursor) return

  const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/modules/${moduleId}/submodules`, {
    limit: SUBMODULE_PAGE_LIMIT,
    cursor: entry.nextCursor,
  })
  const subtopics = res.data.data?.submodules || []
  const nextCursor = res.data.data?.nextCursor ?? null
  dispatch(appendSubtopicsForTopic({ topicId: moduleId, subtopics, nextCursor }))
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

// fire-and-return — for the performance chart's module drill-down, no Redux state
export const fetchDiagnosticProgressSubmodules = (moduleId) => async () => {
  const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/progress/modules/${moduleId}/submodules`)
  return res.data.data || []
}

// The backend stays cursor-paginated (bounded per-request), but the chart needs the
// complete list — so page through it here rather than removing pagination server-side.
async function fetchAllDiagnosticProgressModules() {
  const modules = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(`${Endpoints.api.diagnosticNodes}/progress/modules`, cursor ? { cursor } : {})
    modules.push(...(res.data.data?.modules || []))
    cursor = res.data.data?.nextCursor ?? null
    if (!cursor) break
  }
  return modules
}

export const fetchDiagnosticProgress = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingProgress: true }))
    const [summaryRes, modules] = await Promise.all([
      getWithToken(`${Endpoints.api.diagnosticNodes}/progress/summary`),
      fetchAllDiagnosticProgressModules(),
    ])
    const totalCounts = summaryRes.data.data || { again: 0, hard: 0, good: 0, easy: 0 }
    const totalQuestions = modules.reduce((sum, t) => sum + (t.totalQuestions ?? 0), 0)
    // Note: Redux state field stays `topics` here — ProgressPanel/useCategoryList (out of this
    // rename's scope) still read `progress.topics`. Only the API-call construction was renamed.
    dispatch(setProgress({ totalQuestions, totalCounts, topics: modules }))
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
