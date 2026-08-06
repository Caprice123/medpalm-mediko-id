import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setTopics, setSubtopics, setSubtopicsForTopic, appendSubtopicsForTopic, setSessionCards, setDueToday, setProgress, setLoading } = actions

const PROGRESS_PAGE_LIMIT = 50

// Fetches only the first page — the dropdown that displays these loads more itself on scroll.
export const fetchFlashcardSubtopicsRaw = (topicId) => async (dispatch, getState) => {
  const cached = getState().flashcardNodes.subtopicsByTopic[topicId]
  if (cached) return cached.items

  const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`, { limit: PROGRESS_PAGE_LIMIT })
  const subtopics = res.data.data?.subtopics || []
  const nextCursor = res.data.data?.nextCursor ?? null
  dispatch(setSubtopicsForTopic({ topicId, subtopics, nextCursor }))
  return subtopics
}

export const loadMoreFlashcardSubtopics = (topicId) => async (dispatch, getState) => {
  const entry = getState().flashcardNodes.subtopicsByTopic[topicId]
  if (!entry?.nextCursor) return

  const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`, {
    limit: PROGRESS_PAGE_LIMIT,
    cursor: entry.nextCursor,
  })
  const subtopics = res.data.data?.subtopics || []
  const nextCursor = res.data.data?.nextCursor ?? null
  dispatch(appendSubtopicsForTopic({ topicId, subtopics, nextCursor }))
}

// The backend stays cursor-paginated (bounded per-request), but the topic list needs the
// complete set — so page through it here rather than removing pagination server-side.
async function fetchAllFlashcardTopics() {
  const topics = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(Endpoints.api.flashcardNodes + '/topics', { limit: PROGRESS_PAGE_LIMIT, ...(cursor ? { cursor } : {}) })
    topics.push(...(res.data.data?.topics || []))
    cursor = res.data.data?.nextCursor ?? null
    if (!cursor) break
  }
  return topics.sort((a, b) => a.name.localeCompare(b.name, 'id'))
}

export const fetchFlashcardTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingTopics: true }))
    const topics = await fetchAllFlashcardTopics()
    dispatch(setTopics(topics))
  } finally {
    dispatch(setLoading({ isFetchingTopics: false }))
  }
}

// Legacy v2 (non-v2-1) SubtopicList page renders the full set at once — page through here.
export const fetchFlashcardSubtopics = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingSubtopics: true }))
    const subtopics = []
    let cursor = null
    for (;;) {
      const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`, {
        limit: PROGRESS_PAGE_LIMIT,
        ...(cursor ? { cursor } : {}),
      })
      subtopics.push(...(res.data.data?.subtopics || []))
      cursor = res.data.data?.nextCursor ?? null
      if (!cursor) break
    }
    dispatch(setSubtopics(subtopics))
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
  const subtopics = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(`${Endpoints.api.flashcardNodes}/progress/topics/${topicId}/subtopics`, {
      limit: PROGRESS_PAGE_LIMIT,
      ...(cursor ? { cursor } : {}),
    })
    subtopics.push(...(res.data.data?.subtopics || []))
    cursor = res.data.data?.nextCursor ?? null
    if (!cursor) break
  }
  return subtopics.sort((a, b) => a.nodeName.localeCompare(b.nodeName, 'id'))
}

// The backend stays cursor-paginated (bounded per-request), but the chart needs the
// complete list — so page through it here rather than removing pagination server-side.
async function fetchAllFlashcardProgressTopics() {
  const topics = []
  let cursor = null
  for (;;) {
    const res = await getWithToken(`${Endpoints.api.flashcardNodes}/progress/topics`, { limit: PROGRESS_PAGE_LIMIT, ...(cursor ? { cursor } : {}) })
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
