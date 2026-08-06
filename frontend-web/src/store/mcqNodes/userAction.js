import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setTopics, setSessionQuestions, setLoading } = actions

export const fetchMcqTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingTopics: true }))
    const res = await getWithToken(`${Endpoints.api.mcqNodes}/topics`)
    dispatch(setTopics(res.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingTopics: false }))
  }
}

const SUBTOPIC_PAGE_LIMIT = 50

// Fetches only the first page — the dropdown that displays these loads more itself on scroll.
export const fetchMcqSubtopicsRaw = (topicId) => async () => {
  const res = await getWithToken(`${Endpoints.api.mcqNodes}/topics/${topicId}/subtopics`, { limit: SUBTOPIC_PAGE_LIMIT })
  return { items: res.data.data?.subtopics || [], nextCursor: res.data.data?.nextCursor ?? null }
}

export const loadMoreMcqSubtopicsRaw = (topicId, cursor) => async () => {
  const res = await getWithToken(`${Endpoints.api.mcqNodes}/topics/${topicId}/subtopics`, { limit: SUBTOPIC_PAGE_LIMIT, cursor })
  return { items: res.data.data?.subtopics || [], nextCursor: res.data.data?.nextCursor ?? null }
}

// The performance chart's drill-down needs the complete set to plot every subtopic, sorted
// by the user's avgScore (unlike the name-sorted picker dropdown above) — page through here
// rather than exposing partial data to the chart.
export const fetchAllMcqSubtopicsRaw = (topicId) => async () => {
  const items = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(`${Endpoints.api.mcqNodes}/topics/${topicId}/subtopics`, {
      limit: SUBTOPIC_PAGE_LIMIT,
      sortBy: 'avgScore',
      ...(cursor ? { cursor } : {}),
    })
    items.push(...(res.data.data?.subtopics || []))
    cursor = res.data.data?.nextCursor ?? null
    if (!cursor) break
  }
  return { items, nextCursor: null }
}

export const startMcqNodeSession = (nodeId, count) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.mcqNodes}/session`, { nodeId, count })
    dispatch(setSessionQuestions(res.data.data || []))
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const startMcqCustomSession = (nodeIds, count) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.mcqNodes}/custom-session`, { nodeIds, count })
    dispatch(setSessionQuestions(res.data.data || []))
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const submitMcqAnswer = (questionId, isCorrect) => async () => {
  try {
    await postWithToken(`${Endpoints.api.mcqNodes}/answer`, { questionId, isCorrect })
  } catch {
    // fire-and-forget — answer log failure should not block the user
  }
}

export const submitMcqSession = (nodeResults, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isSubmittingSession: true }))
    await postWithToken(`${Endpoints.api.mcqNodes}/submit`, { nodeResults })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isSubmittingSession: false }))
  }
}
