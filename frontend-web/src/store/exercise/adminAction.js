import { actions } from '@store/exercise/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTags,
  setFilters,
  setDetail,
  updatePagination,
} = actions

// ============= Admin Topics Actions =============

/**
 * Fetch all exercise topics for admin panel
 */
export const fetchAdminExerciseTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))

    const { filters, pagination } = getState().exercise
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const route = Endpoints.exercises.admin.topics
    const response = await getWithToken(route, queryParams)

    // Backend returns { data: { topics: [...], pagination: {...} } }
    const responseData = response.data

    // New paginated response
    dispatch(setTopics(responseData.data))
    dispatch(updatePagination(responseData.pagination))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single topic with questions (for editing in admin)
 */
export const fetchExerciseTopic = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailExerciseTopicLoading', value: true }))

    const route = Endpoints.exercises.admin.topic(topicId)
    const response = await getWithToken(route)

    const topic = response.data.data || response.data.topic
    dispatch(setDetail(topic))
    if (onSuccess) onSuccess()
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetDetailExerciseTopicLoading', value: false }))
  }
}

/**
 * Generate questions using Gemini (admin only)
 */
export const generateQuestions = (content, type, questionCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: true }))

    const requestBody = {
      content,
      type,
      questionCount
    }

    const response = await postWithToken(Endpoints.exercises.admin.generate, requestBody)

    const questions = response.data.data || response.data.questions || []
    return questions
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: false }))
  }
}

/**
 * Generate questions from PDF using Gemini (admin only)
 * Note: File should already be uploaded via common upload action
 */
export const generateQuestionsFromPDF = (blobId, questionCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: true }))

    const response = await postWithToken(Endpoints.exercises.admin.generateFromPDF, {
      blobId,
      questionCount
    })

    const data = response.data.data || {}
    const questions = data.questions || []

    return { questions, blobId: data.blobId || blobId }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: false }))
  }
}

/**
 * Create new topic with questions (admin only)
 * Supports both JSON (text-based) and FormData (PDF-based)
 * FormData is automatically detected and handled by postWithToken
 */
export const createExerciseTopic = (topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const response = await postWithToken(Endpoints.exercises.admin.topics, topicData)

    const topic = response.data.data || response.data.topic
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

/**
 * Update topic (admin only)
 * Supports updating title, description, status, tags, questions, and blobId
 */
export const updateExerciseTopic = (topicId, topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const response = await putWithToken(
      Endpoints.exercises.admin.topic(topicId),
      topicData
    )

    const topic = response.data.data || response.data.topic
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

/**
 * Update topic questions (admin only)
 * @deprecated Use updateExerciseTopic instead
 */
export const updateTopicQuestions = (topicId, questions) => async (dispatch) => {
  return updateExerciseTopic(topicId, { questions })(dispatch)
}

/**
 * Add manual question to topic (admin only)
 */
export const addManualQuestion = (topicId, questionData) => async (dispatch) => {
  try {
    const response = await postWithToken(
      Endpoints.exercises.admin.topic(topicId),
      questionData
    )

    return response.data.question
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

/**
 * Delete topic (admin only)
 */
export const deleteExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingTopic', value: true }))

    await deleteWithToken(Endpoints.exercises.admin.topic(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}

// ============= Tags Actions =============

/**
 * Fetch all tags (admin endpoint)
 */
export const fetchExerciseTags = (type = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTagsLoading', value: true }))

    const queryParams = {}
    if (type) queryParams.type = type

    const response = await getWithToken(Endpoints.exercises.admin.tags, queryParams)

    dispatch(setTags(response.data.data || response.data.tags || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTagsLoading', value: false }))
  }
}


// ============= Filter Actions =============

/**
 * Update filters
 */
export const updateExerciseFilters = (filters) => (dispatch) => {
  dispatch(setFilters(filters))
}