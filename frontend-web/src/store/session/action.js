import { actions } from '@store/session/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setCurrentSession,
  setTopicSnapshot,
  setCurrentQuestionIndex,
  addAnswer,
  clearCurrentSession,
  setSessions,
  setSessionDetail,
  setSessionAttempts,
  setAttemptDetail,
  setPagination,
  setLoading,
  setError,
  clearError
} = actions

// ============= Session Management Actions =============


export const createSession = (sessionType, onSuccess) => async (dispatch) => {
    try {
        dispatch(setLoading({ key: 'isCreatingSession', value: true }))
        dispatch(clearError())

        const response = await postWithToken(Endpoints.sessions.create, {
            sessionType
        })

        const { data } = response.data

        dispatch(setCurrentSession({
          id: data.first_attempt_id,
          exerciseSessionId: data.exercise_session_id,
          userLearningSessionId: data.user_learning_session_id,
          status: data.status
        }))

        if (onSuccess) onSuccess(data)
        return data
    } catch (err) {
        handleApiError(err, dispatch)
        throw err
    } finally {
        dispatch(setLoading({ key: 'isCreatingSession', value: false }))
    }
}

/**
 * Start exercise with topic selection
 */
export const startExerciseWithTopic = (userLearningSessionId, attemptId, topicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingSession', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.sessions.exercise.attempts.start(attemptId), {
      userLearningSessionId,
      topicId
    })

    const data = response.data.data

    dispatch(setTopicSnapshot(data.topic_snapshot))
    dispatch(setCurrentSession({
      id: data.attempt.id,
      attemptNumber: data.attempt.attempt_number,
      status: data.attempt.status,
      creditsUsed: data.attempt.credits_used,
      totalQuestions: data.attempt.total_questions,
      score: data.attempt.score
    }))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingSession', value: false }))
  }
}

/**
 * Create a new exercise session (old flow - direct with topic)
 */
export const createExerciseSession = (exerciseTopicId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingSession', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.sessions.exercise.create, {
      exerciseTopicId
    })

    const data = response.data.data

    dispatch(setCurrentSession({
      id: data.session_id,
      userLearningSessionId: data.user_learning_session_id,
      creditsUsed: data.credits_used,
      totalQuestions: data.total_questions
    }))
    dispatch(setTopicSnapshot(data.topic_snapshot))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingSession', value: false }))
  }
}

/**
 * Move to next question
 */
export const nextQuestion = () => (dispatch, getState) => {
  const { session } = getState()
  const nextIndex = session.currentQuestionIndex + 1
  dispatch(setCurrentQuestionIndex(nextIndex))
}

/**
 * Complete the current attempt with optional answers
 */
export const completeSession = (attemptId, answers = null) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCompletingSession', value: true }))
    dispatch(clearError())

    const response = await putWithToken(
      Endpoints.sessions.exercise.attempts.complete(attemptId),
      answers ? { answers } : {}
    )

    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCompletingSession', value: false }))
  }
}

/**
 * Clear current session
 */
export const clearSession = () => (dispatch) => {
  dispatch(clearCurrentSession())
}

// ============= Session History Actions =============

/**
 * Fetch user's session history
 */
export const fetchSessions = (status = null, limit = 30, offset = 0) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessions', value: true }))
    dispatch(clearError())

    const queryParams = { limit, offset }
    if (status) queryParams.status = status

    const response = await getWithToken(Endpoints.sessions.list, queryParams)

    const { data, pagination } = response.data

    dispatch(setSessions(data))
    dispatch(setPagination({
      limit: pagination.limit,
      offset: pagination.offset,
      isLastPage: pagination.isLastPage
    }))

    return pagination
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessions', value: false }))
  }
}

/**
 * Fetch attempt detail
 */
export const fetchSessionDetail = (attemptId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingDetail', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.sessions.detail(attemptId))

    const data = response.data.data

    dispatch(setSessionDetail(data))

    // Also set currentSession and topicSnapshot for ExercisePlayer
    if (data.topic_snapshot) {
      // Backend already parses topic_snapshot, so it's an object
      dispatch(setTopicSnapshot(data.topic_snapshot))
      dispatch(setCurrentSession({
        id: data.id,
        attemptNumber: data.attempt_number,
        exerciseSessionId: data.exercise_session_id,
        status: data.status,
        creditsUsed: data.credits_used,
        totalQuestions: data.total_questions,
        score: data.score
      }))

      // Set current question index based on answers
      const answeredCount = data.answers ? data.answers.length : 0
      dispatch(setCurrentQuestionIndex(answeredCount))

      // Also store the answers in Redux for the player
      if (data.answers && data.answers.length > 0) {
        // Note: We're not storing full answer history in this flow
        // The ExercisePlayer will work with current state
      }
    }

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingDetail', value: false }))
  }
}

/**
 * Fetch all attempts for a learning session with pagination
 */
export const fetchSessionAttempts = (learningSessionId, limit = 30, offset = 0) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingAttempts', value: true }))
    dispatch(clearError())

    const queryParams = { limit, offset }
    const response = await getWithToken(Endpoints.sessions.exercise.attempts.get(learningSessionId), queryParams)

    const { data, pagination } = response.data

    dispatch(setSessionAttempts(data || []))
    dispatch(setPagination({
      limit: pagination.limit,
      offset: pagination.offset,
      isLastPage: pagination.isLastPage
    }))

    return pagination
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingAttempts', value: false }))
  }
}

export const fetchSessionAttemptDetail = (attemptId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingAttemptDetail', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.sessions.exercise.attempts.detail(attemptId))

    const data = response.data.data

    // Store only attempt detail (questions and answers) for ExercisePlayer
    const attemptDetail = {
      questions: data.questions || [],
      answers: data.answers || []
    }
    dispatch(setAttemptDetail(attemptDetail))

    return attemptDetail
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingAttemptDetail', value: false }))
  }
}

/**
 * Create a new attempt for a learning session
 */
export const createNewAttempt = (learningSessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingAttempt', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.sessions.exercise.attempts.create(learningSessionId), {})

    const data = response.data.data

    return data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingAttempt', value: false }))
  }
}
