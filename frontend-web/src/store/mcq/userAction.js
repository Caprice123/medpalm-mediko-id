import { actions } from '@store/mcq/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setLoading, setTopics, setPagination, setCurrentSession } = actions

/**
 * Fetch all published MCQ topics (user endpoint)
 */
export const fetchMcqTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))

    const { filter, pagination } = getState().mcq

    const queryParams = {}
    if (filter.topic) queryParams.topic = filter.topic
    if (filter.department) queryParams.department = filter.department
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.search) queryParams.search = filter.search
    queryParams.page = pagination.page
    queryParams.limit = pagination.limit

    const route = Endpoints.api.mcq + "/topics"
    const response = await getWithToken(route, queryParams)

    const data = response.data
    dispatch(setTopics(data.data || []))
    dispatch(setPagination(data.pagination || { page: 1, limit: 30, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single MCQ topic by ID (user endpoint)
 */
export const fetchMcqTopicById = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicLoading', value: true }))

    const route = Endpoints.api.mcq + `/topics/${topicId}`
    const response = await getWithToken(route)

    const topic = response.data.data
    dispatch(actions.setCurrentTopic(topic))
    return topic
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Submit MCQ answers and get results
 */
export const submitMcqAnswers = (topicId, answers, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoading', value: true }))

    const route = Endpoints.api.mcq + `/topics/${topicId}/submit`
    const response = await postWithToken(route, { answers })

    if (onSuccess) onSuccess(response.data.data)
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoading', value: false }))
  }
}

/**
 * Fetch MCQ topic session (questions for learning or quiz mode)
 */
export const fetchMcqTopicSession = (topicId, mode = 'learning') => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicLoading', value: true }))

    const route = Endpoints.api.mcq + `/topics/${topicId}/session`
    const response = await getWithToken(route, { mode })

    const session = response.data.data
    dispatch(setCurrentSession(session))
    return session
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Check answers for MCQ topic
 */
export const checkMcqAnswers = (topicId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isChecking', value: true }))

    const route = Endpoints.api.mcq + `/topics/${topicId}/check`
    const response = await postWithToken(route, { answers })

    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isChecking', value: false }))
  }
}
