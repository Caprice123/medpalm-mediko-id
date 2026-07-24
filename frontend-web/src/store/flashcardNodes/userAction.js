import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setTopics, setSubtopics, setSessionCards, setDueToday, setProgress, setLoading } = actions

export const fetchFlashcardSubtopicsRaw = (topicId) => async () => {
  const res = await getWithToken(`${Endpoints.api.flashcardNodes}/topics/${topicId}/subtopics`)
  return res.data.data || []
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

export const fetchFlashcardProgress = () => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingProgress: true }))
    const [summaryRes, topicsRes] = await Promise.all([
      getWithToken(`${Endpoints.api.flashcardNodes}/progress/summary`),
      getWithToken(`${Endpoints.api.flashcardNodes}/progress/topics`),
    ])
    const totalCounts = summaryRes.data.data || { again: 0, hard: 0, good: 0, easy: 0 }
    const topics = topicsRes.data.data?.topics || []
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
