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

export const fetchMcqSubtopicsRaw = (topicId) => async () => {
  const res = await getWithToken(`${Endpoints.api.mcqNodes}/topics/${topicId}/subtopics`)
  return res.data.data || []
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
