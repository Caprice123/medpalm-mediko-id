import { actions } from '@store/anatomy/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setQuizzes,
  setSelectedQuiz,
  setQuestions,
  setCurrentQuiz,
  setQuizResult,
  setUploadedImage,
  setFilter,
  clearFilter,
  clearError,
  addQuiz,
  updateQuiz,
  removeQuiz,
  addQuestion,
  updateQuestion,
  removeQuestion,
  clearUploadedImage,
  clearSelectedQuiz,
  clearCurrentQuiz
} = actions

// ============= User Actions =============

/**
 * Fetch all published anatomy quizzes (user endpoint)
 */
export const fetchAnatomyQuizzes = (filter = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuizzesLoading', value: true }))

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester

    const response = await getWithToken(Endpoints.anatomy.quizzes, queryParams)

    dispatch(setQuizzes(response.data.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isQuizzesLoading', value: false }))
  }
}

/**
 * Fetch single quiz for user to take (subscription check)
 */
export const fetchAnatomyQuizForUser = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuizLoading', value: true }))

    const response = await getWithToken(Endpoints.anatomy.quiz(quizId))

    const quiz = response.data.data || response.data.quiz
    dispatch(setCurrentQuiz(quiz))
    return quiz
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isQuizLoading', value: false }))
  }
}

/**
 * Submit quiz answers
 */
export const submitAnatomyQuizAnswers = (quizId, answers) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitting', value: true }))

    const response = await postWithToken(Endpoints.anatomy.submit(quizId), { answers })

    const result = response.data.data
    dispatch(setQuizResult(result))
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSubmitting', value: false }))
  }
}

// ============= Admin Actions =============

/**
 * Fetch all anatomy quizzes for admin panel
 */
export const fetchAdminAnatomyQuizzes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isQuizzesLoading', value: true }))

    const { filter } = getState().anatomy

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.status) queryParams.status = filter.status

    const response = await getWithToken(Endpoints.anatomy.admin.quizzes, queryParams)

    dispatch(setQuizzes(response.data.data || []))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isQuizzesLoading', value: false }))
  }
}

/**
 * Fetch single quiz for admin editing
 */
export const fetchAdminAnatomyQuiz = (quizId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isQuizLoading', value: true }))

    const response = await getWithToken(Endpoints.anatomy.admin.quiz(quizId))

    const quiz = response.data.data || response.data.quiz
    dispatch(setSelectedQuiz(quiz))
    dispatch(setQuestions(quiz.anatomy_questions || quiz.questions || []))
    return quiz
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isQuizLoading', value: false }))
  }
}

/**
 * Upload anatomy image (admin only)
 */
export const uploadAnatomyImage = (form, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUploadingImage', value: true }))

    const formData = new FormData()
    formData.append('image', form.file)

    const response = await postWithToken(Endpoints.anatomy.admin.uploadImage, formData)

    const data = response.data.data
    const imageInfo = {
      image_url: data.image_url,
      image_key: data.image_key,
      image_filename: data.image_filename
    }

    dispatch(setUploadedImage(imageInfo))
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
 * Create new anatomy quiz (admin only)
 */
export const createAnatomyQuiz = (quizData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingQuiz', value: true }))

    const response = await postWithToken(Endpoints.anatomy.admin.quizzes, quizData)

    const quiz = response.data.data || response.data.quiz
    dispatch(addQuiz(quiz))
    dispatch(clearUploadedImage())
    return quiz
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingQuiz', value: false }))
  }
}

/**
 * Update anatomy quiz (admin only)
 */
export const updateAnatomyQuiz = (quizId, quizData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingQuiz', value: true }))

    const response = await putWithToken(Endpoints.anatomy.admin.quiz(quizId), quizData)

    const quiz = response.data.data || response.data.quiz
    dispatch(updateQuiz(quiz))
    return quiz
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingQuiz', value: false }))
  }
}

/**
 * Delete anatomy quiz (admin only)
 */
export const deleteAnatomyQuiz = (quizId, hardDelete = false) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingQuiz', value: true }))

    await deleteWithToken(
      `${Endpoints.anatomy.admin.quiz(quizId)}${hardDelete ? '?hardDelete=true' : ''}`
    )

    dispatch(removeQuiz(quizId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeletingQuiz', value: false }))
  }
}

// ============= Filter Actions =============

/**
 * Update filter
 */
export const updateAnatomyFilter = (filter) => (dispatch) => {
  dispatch(setFilter(filter))
}

/**
 * Clear all filter
 */
export const clearAnatomyFilter = () => (dispatch) => {
  dispatch(clearFilter())
}

/**
 * Clear selected quiz and questions
 */
export const clearAnatomySelection = () => (dispatch) => {
  dispatch(clearSelectedQuiz())
}

/**
 * Clear current quiz (user side)
 */
export const clearAnatomyCurrentQuiz = () => (dispatch) => {
  dispatch(clearCurrentQuiz())
}

// ============= Constants Actions =============

/**
 * Fetch anatomy constants (admin only)
 */
export const fetchAnatomyConstants = (keys = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConstantsLoading', value: true }))

    const queryParams = {}
    if (keys && Array.isArray(keys)) {
      queryParams.keys = keys.join(',')
    }

    const response = await getWithToken(Endpoints.anatomy.admin.constants, queryParams)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConstantsLoading', value: false }))
  }
}

/**
 * Update anatomy constants (admin only)
 */
export const updateAnatomyConstants = (constants) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: true }))

    const response = await putWithToken(Endpoints.anatomy.admin.constants, constants)

    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingConstants', value: false }))
  }
}
