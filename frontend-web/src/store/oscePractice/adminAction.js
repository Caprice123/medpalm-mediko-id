import { actions } from '@store/oscePractice/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTopicDetail,
  setObservations,
  updatePagination,
} = actions

export const fetchAdminOsceTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListTopicsLoading', value: true }))

    const { filters, pagination } = getState().oscePractice
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester
    if (filters.status) queryParams.status = filters.status

    const route = Endpoints.admin.oscePractice + "/topics"
    const response = await getWithToken(route, queryParams)

    const topics = response.data.data || []
    const paginationData = response.data.pagination

    dispatch(setTopics(topics))
    if (paginationData) {
      dispatch(updatePagination(paginationData))
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListTopicsLoading', value: false }))
  }
}

export const fetchOsceTopic = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetTopicDetailLoading', value: true }))

    const route = Endpoints.admin.oscePractice + "/topics" + `/${topicId}`
    const response = await getWithToken(route)

    const topic = response.data.data
    dispatch(setTopicDetail(topic))
    if (onSuccess) onSuccess()
    return topic
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetTopicDetailLoading', value: false }))
  }
}

export const createOsceTopic = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const route = Endpoints.admin.oscePractice + "/topics"
    const response = await postWithToken(route, data)

    if (onSuccess) onSuccess()
    dispatch(fetchAdminOsceTopics())
    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

export const updateOsceTopic = (topicId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const route = Endpoints.admin.oscePractice + "/topics" + `/${topicId}`
    const response = await putWithToken(route, data)

    if (onSuccess) onSuccess()
    dispatch(fetchAdminOsceTopics())
    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}

// Observation Groups
export const createObservationGroup = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const route = Endpoints.admin.oscePractice + "/observation-groups"
    await postWithToken(route, data)

    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

export const updateObservationGroup = (groupId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingObservationGroup', value: true }))

    const route = Endpoints.admin.oscePractice + "/observation-groups" + `/${groupId}`
    await putWithToken(route, data)

    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingObservationGroup', value: false }))
  }
}

// Observations
export const fetchAdminOsceObservations = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetListObservationsLoading', value: true }))

    const route = Endpoints.admin.oscePractice + "/observations"
    const response = await getWithToken(route, data)

    const observations = response.data.data || []
    dispatch(setObservations(observations))
    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGetListObservationsLoading', value: false }))
  }
}

export const createObservation = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingTopic', value: true }))

    const route = Endpoints.admin.oscePractice + "/observations"
    await postWithToken(route, data)

    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreatingTopic', value: false }))
  }
}

export const updateObservation = (observationId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: true }))

    const route = Endpoints.admin.oscePractice + "/observations" + `/${observationId}`
    await putWithToken(route, data)

    if (onSuccess) onSuccess()
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}
