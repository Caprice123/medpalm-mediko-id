import { actions } from '@store/oscePractice/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setUserTopics,
  setUserSessions,
  setSessionDetail,
  setSessionMessages,
  setSessionObservations,
  setSessionDiagnoses,
  setSessionTherapies,
} = actions

// Fetch available topics for user
export const fetchUserOsceTopics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingUserTopics', value: true }))

    const route = Endpoints.api.osceTopics
    const response = await getWithToken(route)

    const topics = response.data.data || []
    dispatch(setUserTopics(topics))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingUserTopics', value: false }))
  }
}

// Fetch user's session history
export const fetchUserOsceSessions = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: true }))

    const route = Endpoints.api.osceSessions
    const response = await getWithToken(route)

    const sessions = response.data.data || []
    dispatch(setUserSessions(sessions))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: false }))
  }
}

// Start a new OSCE practice session
export const startOsceSession = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: true }))

    const route = Endpoints.api.osceSessions
    const response = await postWithToken(route, { topicId })

    if (onSuccess) onSuccess(response.data.data)
    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: false }))
  }
}

// Fetch session detail by uniqueId
export const fetchSessionDetail = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionDetail', value: true }))

    const route = `${Endpoints.api.osceSessions}/${sessionId}`
    const response = await getWithToken(route)

    const sessionDetail = response.data.data || null
    dispatch(setSessionDetail(sessionDetail))
    return sessionDetail
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessionDetail', value: false }))
  }
}

// Fetch session messages
export const fetchSessionMessages = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionMessages', value: true }))

    const route = Endpoints.api.osceMessages(sessionId)
    const response = await getWithToken(route)

    const messages = response.data.data || []
    dispatch(setSessionMessages(messages))
    return messages
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessionMessages', value: false }))
  }
}

// Fetch session observations
export const fetchSessionObservations = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionObservations', value: true }))

    const route = Endpoints.api.osceObservations(sessionId)
    const response = await getWithToken(route)

    const observations = response.data.data || []
    dispatch(setSessionObservations(observations))
    return observations
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessionObservations', value: false }))
  }
}

// Fetch session diagnoses
export const fetchSessionDiagnoses = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionDiagnoses', value: true }))

    const route = Endpoints.api.osceDiagnoses(sessionId)
    const response = await getWithToken(route)

    const diagnoses = response.data.data || []
    dispatch(setSessionDiagnoses(diagnoses))
    return diagnoses
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessionDiagnoses', value: false }))
  }
}

// Fetch session therapies
export const fetchSessionTherapies = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionTherapies', value: true }))

    const route = Endpoints.api.osceTherapies(sessionId)
    const response = await getWithToken(route)

    const therapies = response.data.data || []
    dispatch(setSessionTherapies(therapies))
    return therapies
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isLoadingSessionTherapies', value: false }))
  }
}
