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
  addTopic,
  updateTopic,
  removeTopic,
  addQuestion,
  clearGeneratedQuestions,
  updatePagination
} = actions

// ============= Topics Actions =============

/**
 * Fetch all exercise topics (user endpoint)
 */
export const fetchExerciseTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isTopicsLoading', value: true }))


    const { filters, pagination } = getState().exercise

    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }

    if (filters.search) queryParams.search = filters.search
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.exercises.topics, queryParams)

    dispatch(setTopics(response.data.data || response.data.topics || []))

    // Update pagination
    if (response.data.pagination) {
      dispatch(updatePagination(response.data.pagination))
    } else {
      // If no pagination in response, assume it's the last page
      dispatch(updatePagination({ isLastPage: true }))
    }
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
    

    const response = await getWithToken(Endpoints.exercises.admin.topic(topicId))

    const topic = response.data.data || response.data.topic
    dispatch(setSelectedTopic(topic))
    dispatch(setQuestions(topic.questions || []))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
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
    

    // Create FormData for PDF upload
    const formData = new FormData()
    formData.append('pdf', pdfFile)
    formData.append('questionCount', questionCount)

    const response = await postWithToken(Endpoints.exercises.admin.generateFromPDF, formData)

    const data = response.data.data || {}
    const questions = data.questions || []
    const pdfInfo = {
      pdf_url: data.pdfUrl,
      pdf_key: data.pdfKey,
      pdf_filename: data.pdfFilename
    }

    dispatch(setGeneratedQuestions(questions))
    return { questions, ...pdfInfo }
  } catch (err) {
    handleApiError(err, dispatch)
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
    

    const response = await postWithToken(Endpoints.exercises.createTopic, topicData)

    const topic = response.data.data || response.data.topic
    dispatch(addTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
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
    

    const response = await postWithToken(Endpoints.exercises.admin.topics, topicData)

    const topic = response.data.data || response.data.topic
    dispatch(addTopic(topic))
    dispatch(clearGeneratedQuestions())
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
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
    dispatch(updateTopic(topic))
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
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

    dispatch(addQuestion(response.data.question))
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

    dispatch(removeTopic(topicId))
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

// ============= Sessionless Exercise Actions =============

/**
 * Start exercise topic directly (sessionless)
 */
export const startExerciseTopic = (topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingExercise', value: true }))
    

    const response = await postWithToken(Endpoints.exercises.start, { topicId })
    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isStartingExercise', value: false }))
  }
}

/**
 * Submit exercise answers and update progress (sessionless)
 */
export const submitExerciseProgress = (topicId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingExercise', value: true }))
    

    const response = await postWithToken(Endpoints.exercises.submit, {
      topicId,
      answers
    })

    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingExercise', value: false }))
  }
}
