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
    } catch {
        // no need to handle anything because already handled in api.jsx
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
      totalQuestions: data.attempt.totalQuestions,
      score: data.attempt.score
    }))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch {
    // no need to handle anything because already handled in api.jsx
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
      totalQuestions: data.totalQuestions
    }))
    dispatch(setTopicSnapshot(data.topic_snapshot))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch {
    // no need to handle anything because already handled in api.jsx
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
  } catch {
    // no need to handle anything because already handled in api.jsx
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
export const fetchSessions = (status = null, page = 1, perPage = 30) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessions', value: true }))
    dispatch(clearError())

    const queryParams = { page, perPage }
    if (status) queryParams.status = status

    const response = await getWithToken(Endpoints.sessions.list, queryParams)

    const { data, pagination } = response.data

    dispatch(setSessions(data))
    dispatch(setPagination({
      page: pagination.page,
      perPage: pagination.perPage,
      isLastPage: pagination.isLastPage
    }))

    return pagination
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
        totalQuestions: data.totalQuestions,
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
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingDetail', value: false }))
  }
}

/**
 * Fetch all attempts for a learning session with pagination
 */
export const fetchSessionAttempts = (learningSessionId, page = 1, perPage = 30) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingAttempts', value: true }))
    dispatch(clearError())

    const queryParams = { page, perPage }
    const response = await getWithToken(Endpoints.sessions.exercise.attempts.get(learningSessionId), queryParams)

    const { data, pagination } = response.data

    dispatch(setSessionAttempts(data || []))
    dispatch(setPagination({
      limit: pagination.limit,
      offset: pagination.offset,
      isLastPage: pagination.isLastPage
    }))

    return pagination
  } catch {
    // no need to handle anything because already handled in api.jsx
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
  } catch {
    // no need to handle anything because already handled in api.jsx
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
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingAttempt', value: false }))
  }
}

// ============= Flashcard Actions (Sessionless) =============

/**
 * Start flashcard deck (no session required)
 */
export const startFlashcardDeck = (deckId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingFlashcard', value: true }))
    dispatch(clearError())

    const route = Endpoints.api.flashcards + "/start"
    const response = await postWithToken(
      route,
      { deckId }
    )

    const data = response.data.data

    // Set deck snapshot for player
    dispatch(setTopicSnapshot(data.deck))
    dispatch(setCurrentSession({
      deckId: deckId,
      totalCards: data.deck.cards.length
    }))
    dispatch(setCurrentQuestionIndex(0))

    return data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isStartingFlashcard', value: false }))
  }
}

/**
 * Submit flashcard progress (updates spaced repetition data)
 */
export const submitFlashcardProgress = (deckId, answers = []) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingAnswers', value: true }))
    dispatch(clearError())

    const route = Endpoints.api.flashcards + "/submit"
    const response = await postWithToken(
      route,
      { deckId, answers }
    )

    const data = response.data.data

    return data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSubmitAnatomyQuizLoadingAnswers', value: false }))
  }
}

/**
 * @deprecated Use submitFlashcardProgress instead
 * Backward compatibility for old session-based flashcard flow
 */
export const submitFlashcardAnswers = submitFlashcardProgress
