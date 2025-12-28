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
  setUploadedQuestionImage,
  setFilters,
  clearFilters,
  clearError,
  addTopic,
  updateTopic,
  removeTopic,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearUploadedQuestionImage,
  clearSelectedTopic,
  clearCurrentSession,
  nextPage,
  previousPage,
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

    const response = await getWithToken(Endpoints.mcq.topics, queryParams)

    dispatch(setTopics(response.data.data?.topics || []))
    dispatch(setPagination(response.data.data?.pagination || { page: 1, limit: 30, isLastPage: false }))
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

    const response = await getWithToken(Endpoints.mcq.topic(topicId))

    const topic = response.data.data
    dispatch(actions.setCurrentTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    const response = await postWithToken(Endpoints.mcq.submit(topicId), { answers })

    const result = response.data.data
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    const response = await getWithToken(Endpoints.mcq.topicSession(topicId), { mode })

    const session = response.data.data
    dispatch(setCurrentSession(session))
    return session
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    const response = await postWithToken(Endpoints.mcq.check(topicId), { answers })

    const result = response.data.data
    // Don't store in Redux, let the component handle it locally
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    const response = await getWithToken(Endpoints.mcq.admin.topics, queryParams)

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

    const response = await getWithToken(Endpoints.mcq.admin.topic(topicId))

    const topic = response.data.data
    dispatch(setSelectedTopic(topic))
    dispatch(setQuestions(topic.questions || []))
    if (onSuccess) onSuccess(topic)
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isTopicLoading', value: false }))
  }
}

/**
 * Upload question image (admin only)
 */
export const uploadQuestionImage = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUploadingImage', value: true }))

    const formData = new FormData()
    formData.append('file', form.file)

    const response = await postWithToken(Endpoints.mcq.admin.uploadQuestionImage, formData)

    const data = response.data.data
    const imageInfo = {
      image_url: data.image_url,
      image_key: data.image_key,
      image_filename: data.image_filename
    }

    dispatch(setUploadedQuestionImage(imageInfo))
    if (onSuccess) onSuccess(imageInfo)
    return imageInfo
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUploadingImage', value: false }))
  }
}

/**
 * Generate MCQ questions from text or PDF (admin only)
 */
export const generateMcqQuestions = ({ content, file, type, questionCount }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))

    const formData = new FormData()
    formData.append('type', type)
    formData.append('questionCount', questionCount || 10)

    if (type === 'pdf' && file) {
      formData.append('file', file)
    } else if (type === 'text' && content) {
      formData.append('content', content)
    } else {
      throw new Error('Invalid generation type or missing required data')
    }

    const response = await postWithToken(Endpoints.mcq.admin.generate, formData)

    const questions = response.data.data
    if (onSuccess) onSuccess(questions)
    return questions
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    const response = await postWithToken(Endpoints.mcq.admin.topics, topicData)

    const topic = response.data.data
    // Reset to page 1 and refresh the list to show the new topic
    dispatch(setPage(1))
    dispatch(fetchAdminMcqTopics())
    dispatch(clearUploadedQuestionImage())
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    await putWithToken(Endpoints.mcq.admin.topic(topicId), topicData)

    // Refresh the list to show updated topic
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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

    await deleteWithToken(Endpoints.mcq.admin.topic(topicId))

    dispatch(removeTopic(topicId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeletingTopic', value: false }))
  }
}

// ============= Filter Actions =============

/**
 * Update filter
 */
export const updateMcqFilter = (filter) => (dispatch) => {
  dispatch(setFilters(filter))
}

/**
 * Clear all filters
 */
export const clearMcqFilter = () => (dispatch) => {
  dispatch(clearFilters())
}

/**
 * Clear selected topic and questions
 */
export const clearMcqSelection = () => (dispatch) => {
  dispatch(clearSelectedTopic())
}

/**
 * Clear current session (user side)
 */
export const clearMcqCurrentSession = () => (dispatch) => {
  dispatch(clearCurrentSession())
}

// ============= Constants Actions =============

/**
 * Fetch MCQ constants (user side)
 */
export const fetchMcqConstantsForUser = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.mcq.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Fetch MCQ constants (admin only)
 */
export const fetchMcqConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.mcq.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update MCQ constants (admin only)
 */
export const updateMcqConstants = (constants, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))

    await putWithToken(Endpoints.mcq.admin.constants, constants)

    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}
