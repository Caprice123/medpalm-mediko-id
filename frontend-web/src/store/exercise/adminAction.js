import { actions } from '@store/exercise/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTags,
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
    const responseData = response.data.data || response.data

    // New paginated response
    dispatch(setTopics(responseData.topics))
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
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: false }))
  }
}

/**
 * Generate questions from PDF using Gemini (admin only)
 */
export const generateQuestionsFromPDF = (pdfFile, questionCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: true }))

    // Step 1: Upload PDF to centralized endpoint to get blobId
    const uploadFormData = new FormData()
    uploadFormData.append('file', pdfFile)
    uploadFormData.append('type', 'exercise')

    const uploadResponse = await postWithToken(Endpoints.api.uploadImage, uploadFormData)
    const blobId = uploadResponse.data.data.blobId

    // Step 2: Generate questions from PDF
    const generateFormData = new FormData()
    generateFormData.append('pdf', pdfFile)
    generateFormData.append('questionCount', questionCount)
    generateFormData.append('blobId', blobId)

    const response = await postWithToken(Endpoints.exercises.admin.generateFromPDF, generateFormData)

    const data = response.data.data || {}
    const questions = data.questions || []

    return { questions, blobId }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

/**
 * Update topic questions (admin only)
 */
export const updateTopicQuestions = (topicId, questions) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const response = await putWithToken(
      Endpoints.exercises.admin.topic(topicId),
      { questions }
    )

    const topic = response.data.data || response.data.topic
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
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
    throw err
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
    throw err
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

// ============= Constants Actions =============

/**
 * Fetch exercise constants (admin only)
 */
export const fetchExerciseConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.exercises.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update exercise constants (admin only)
 */
export const updateExerciseConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))

    const response = await putWithToken(Endpoints.exercises.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}
