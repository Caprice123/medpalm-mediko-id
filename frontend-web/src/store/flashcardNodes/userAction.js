import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setTopics, setSubtopics, setSubtopicsForTopic, setSessionCards, setDueToday, setProgress, setLoading } = actions

export const fetchFlashcardSubtopicsRaw = (topicId) => async (dispatch, getState) => {
  const cached = getState().flashcardNodes.subtopicsByTopic[topicId]
  if (cached) return cached

  const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`)
  const subtopics = res.data.data || []
  dispatch(setSubtopicsForTopic({ topicId, subtopics }))
  return subtopics
}

export const fetchFlashcardTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingTopics: true }))
    const res = await getWithToken(Endpoints.api.flashcardNodes + '/topics')
    dispatch(setTopics(res.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingTopics: false }))
  }
}

export const fetchFlashcardSubtopics = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingSubtopics: true }))
    const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`)
    dispatch(setSubtopics(res.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingSubtopics: false }))
  }
}

export const startFlashcardNodeSession = (nodeId, count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.flashcardNodes}/session`, { nodeId, count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const startFlashcardCustomSession = (nodeIds, count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.flashcardNodes}/custom-session`, { nodeIds, count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const fetchFlashcardDueToday = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingDueToday: true }))
    const res = await getWithToken(`${Endpoints.api.flashcardNodes}/due-today`)
    dispatch(setDueToday(res.data.data || null))
  } finally {
    dispatch(setLoading({ isFetchingDueToday: false }))
  }
}

// fire-and-return — for the performance chart's topic drill-down, no Redux state
export const fetchFlashcardProgressSubtopics = (topicId) => async () => {
  const res = await getWithToken(`${Endpoints.api.flashcardNodes}/progress/topics/${topicId}/subtopics`)
  return res.data.data || []
}

// The backend stays cursor-paginated (bounded per-request), but the chart needs the
// complete list — so page through it here rather than removing pagination server-side.
async function fetchAllFlashcardProgressTopics() {
  const topics = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(`${Endpoints.api.flashcardNodes}/progress/topics`, cursor ? { cursor } : {})
    topics.push(...(res.data.data?.topics || []))
    cursor = res.data.data?.nextCursor ?? null
    if (!cursor) break
  }
  return topics
}

export const fetchFlashcardProgress = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingProgress: true }))
    const [summaryRes, topics] = await Promise.all([
      getWithToken(`${Endpoints.api.flashcardNodes}/progress/summary`),
      fetchAllFlashcardProgressTopics(),
    ])
    const totalCounts = summaryRes.data.data || { again: 0, hard: 0, good: 0, easy: 0 }
    const totalCards = topics.reduce((sum, t) => sum + (t.totalCards ?? 0), 0)
    dispatch(setProgress({ totalCards, totalCounts, topics }))
  } finally {
    dispatch(setLoading({ isFetchingProgress: false }))
  }
}

export const startFlashcardDueSession = (count, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.flashcardNodes}/due-session`, { count })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}

export const submitFlashcardRating = (recordId, rating) => async (dispatch) => {
  try {
    dispatch(setLoading({ isSubmittingRating: true }))
    await postWithToken(`${Endpoints.api.flashcardNodes}/rate`, { recordId, rating })
  } finally {
    dispatch(setLoading({ isSubmittingRating: false }))
  }
}

export const startFlashcardNodeDueSession = (nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isStartingSession: true }))
    const res = await postWithToken(`${Endpoints.api.flashcardNodes}/node-due-session`, { nodeId })
    dispatch(setSessionCards(res.data.data || []))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isStartingSession: false }))
  }
}
