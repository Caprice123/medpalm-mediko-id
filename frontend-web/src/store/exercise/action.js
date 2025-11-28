import { actions } from '@store/exercise/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTags,
  setSelectedTopic,
  setQuestions,
  setGeneratedQuestions,
  setFilters,
  clearFilters,
  clearError,
  addTopic,
  updateTopic,
  removeTopic,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearGeneratedQuestions,
  clearSelectedTopic
} = actions

// ============= Topics Actions =============

/**
 * Fetch all exercise topics (user endpoint)
 */
export const fetchExerciseTopics = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.exercises.topics, queryParams)

    dispatch(setTopics(response.data.data || response.data.topics || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch all exercise topics for admin panel
 */
export const fetchAdminExerciseTopics = (filters = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))
    dispatch(clearError())

    const queryParams = {}
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.exercises.admin.topics, queryParams)

    dispatch(setTopics(response.data.data || response.data.topics || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTopicsLoading', value: false }))
  }
}

/**
 * Fetch single topic with questions (for editing in admin)
 */
export const fetchExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuestionsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.exercises.admin.topic(topicId))

    const topic = response.data.data || response.data.topic
    dispatch(setSelectedTopic(topic))
    dispatch(setQuestions(topic.questions || []))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isQuestionsLoading', value: false }))
  }
}

/**
 * Generate questions using Gemini (admin only)
 */
export const generateQuestions = (content, type, questionCount = 10) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: true }))
    dispatch(clearError())

    const requestBody = {
      content,
      type,
      questionCount
    }

    const response = await postWithToken(Endpoints.exercises.admin.generate, requestBody)

    const questions = response.data.data || response.data.questions || []
    dispatch(setGeneratedQuestions(questions))
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
    dispatch(clearError())

    // Create FormData for PDF upload
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('questionCount', questionCount)

    const response = await postWithToken(Endpoints.exercises.admin.generateFromPDF, formData)

    const data = response.data.data || {}
    const questions = data.questions || []
    const pdfInfo = {
      pdf_url: data.pdf_url,
      pdf_key: data.pdf_key,
      pdf_filename: data.pdf_filename
    }

    dispatch(setGeneratedQuestions(questions))
    return { questions, ...pdfInfo }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingQuestions', value: false }))
  }
}

/**
 * Create new topic with questions (for regular users)
 */
export const createUserExerciseTopic = (topicData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.exercises.createTopic, topicData)

    const topic = response.data.data || response.data.topic
    dispatch(addTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
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
    dispatch(clearError())

    const response = await postWithToken(Endpoints.exercises.admin.topics, topicData)

    const topic = response.data.data || response.data.topic
    dispatch(addTopic(topic))
    dispatch(clearGeneratedQuestions())
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
    dispatch(clearError())

    const response = await putWithToken(
      Endpoints.exercises.admin.topic(topicId),
      { questions }
    )

    const topic = response.data.data || response.data.topic
    dispatch(updateTopic(topic))
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
    dispatch(clearError())

    const response = await postWithToken(
      Endpoints.exercises.admin.topic(topicId),
      questionData
    )

    dispatch(addQuestion(response.data.question))
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
    dispatch(clearError())

    await deleteWithToken(Endpoints.exercises.admin.topic(topicId))

    dispatch(removeTopic(topicId))
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
    dispatch(clearError())

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

/**
 * Clear all filters
 */
export const clearExerciseFilters = () => (dispatch) => {
  dispatch(clearFilters())
}

/**
 * Clear selected topic and questions
 */
export const clearExerciseSelection = () => (dispatch) => {
  dispatch(clearSelectedTopic())
}

// ============= Constants Actions =============

/**
 * Fetch exercise constants (admin only)
 */
export const fetchExerciseConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))
    dispatch(clearError())

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
    dispatch(clearError())

    const response = await putWithToken(Endpoints.exercises.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}

// ============= Sessionless Exercise Actions =============

/**
 * Start exercise topic directly (sessionless)
 */
export const startExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingExercise', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.exercises.start, { topicId })
    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isStartingExercise', value: false }))
  }
}

/**
 * Submit exercise answers and update progress (sessionless)
 */
export const submitExerciseProgress = (topicId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmittingExercise', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.exercises.submit, {
      topicId,
      answers
    })

    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSubmittingExercise', value: false }))
  }
}
