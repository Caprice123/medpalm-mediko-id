import { actions } from '@store/mcq/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setTopics,
  setPagination,
  setSelectedTopic,
  setQuestions,
  setCurrentSession,
  removeTopic,
  clearUploadedQuestionImage,
  setPage
} = actions

// ============= User Actions =============

/**
 * Fetch all published MCQ topics (user endpoint)
 */
export const fetchMcqTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))

    const { filter, pagination } = getState().mcq

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.search) queryParams.search = filter.search

    // Add pagination parameters
    queryParams.page = pagination.page
    queryParams.limit = pagination.limit

    const route = Endpoints.api.mcq + "/topics"
    const response = await getWithToken(route, queryParams)

    const data = response.data
    dispatch(setTopics(data.data || []))
    dispatch(setPagination(data.pagination || { page: 1, limit: 30, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
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
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Submit MCQ answers and get results
 */
export const submitMcqAnswers = (topicId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoading', value: true }))

    const route = Endpoints.api.mcq + `/topics/${topicId}/submit`
    const response = await postWithToken(route, { answers })

    const result = response.data.data
    return result
  } catch (err) {
    handleApiError(err, dispatch)
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
  } catch (err) {
    handleApiError(err, dispatch)
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

    const result = response.data.data
    // Don't store in Redux, let the component handle it locally
    return result
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isChecking', value: false }))
  }
}

// ============= Admin Actions =============

/**
 * Fetch all MCQ topics for admin panel
 */
export const fetchAdminMcqTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))

    const { filter, pagination } = getState().mcq

    const queryParams = {}
    if (filter.status) queryParams.status = filter.status
    if (filter.search) queryParams.search = filter.search

    // Add pagination parameters
    queryParams.page = pagination.page
    queryParams.limit = pagination.limit

    const route = Endpoints.admin.mcq + "/topics"
    const response = await getWithToken(route, queryParams)

    dispatch(setTopics(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, limit: 30, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single topic for admin editing
 */
export const fetchMcqTopicDetail = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicLoading', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    const response = await getWithToken(route)

    const topic = response.data.data
    dispatch(setSelectedTopic(topic))
    dispatch(setQuestions(topic.questions || []))
    if (onSuccess) onSuccess(topic)
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Generate MCQ questions from text or PDF (admin only)
 */
export const generateMcqQuestions = ({ content, type, questionCount, blobId }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))

    const requestBody = {
        type: type,
        questionCount: questionCount
    }
    if (type === 'pdf') {
      // If we have a blobId, send only the blobId (no need to send binary file)
      requestBody.blobId = blobId
    } else if (type === 'text' && content) {
      requestBody.content = content
    } else {
      throw new Error('Invalid generation type or missing required data')
    }

    const route = Endpoints.admin.mcq + "/generate"
    const response = await postWithToken(route, requestBody)

    const questions = response.data.data
    if (onSuccess) onSuccess(questions)
    return questions
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGenerating', value: false }))
  }
}

/**
 * Create new MCQ topic (admin only)
 */
export const createMcqTopic = (topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const route = Endpoints.admin.mcq + "/topics"
    const response = await postWithToken(route, topicData)

    const topic = response.data.data
    // Reset to page 1 and refresh the list to show the new topic
    dispatch(setPage(1))
    dispatch(fetchAdminMcqTopics())
    dispatch(clearUploadedQuestionImage())
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

/**
 * Update MCQ topic (admin only)
 */
export const updateMcqTopic = (topicId, topicData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    await putWithToken(route, topicData)

    // Refresh the list to show updated topic
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

/**
 * Delete MCQ topic (admin only)
 */
export const deleteMcqTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingTopic', value: true }))

    const route = Endpoints.admin.mcq + `/topics/${topicId}`
    await deleteWithToken(route)

    dispatch(removeTopic(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}
