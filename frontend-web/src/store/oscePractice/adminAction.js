import { actions } from '@store/oscePractice/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setTopics,
  setTopicDetail,
  setObservations,
  updatePagination,
  setRubrics,
  setRubricDetail,
  updateRubricPagination,
  setAllRubrics,
} = actions

export const fetchAdminOsceTopics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListTopicsLoading', value: true }))

    const { filters, pagination } = getState().oscePractice
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.search) queryParams.search = filters.search
    if (filters.topic) queryParams.topic = filters.topic
    if (filters.batch) queryParams.batch = filters.batch
    if (filters.status) queryParams.status = filters.status

    const route = Endpoints.admin.oscePractice + "/topics"
    const response = await getWithToken(route, queryParams)

    const topics = response.data.data || []
    const paginationData = response.data.pagination

    dispatch(setTopics(topics))
    if (paginationData) {
      dispatch(updatePagination(paginationData))
    }
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
  } finally {
    dispatch(setLoading({ key: 'isUpdatingTopic', value: false }))
  }
}


// Rubrics
export const fetchAdminOsceRubrics = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: "isGetListRubricsLoading", value: true }))

    const { rubricFilters, rubricPagination } = getState().oscePractice
    const queryParams = {
      page: rubricPagination.page,
      perPage: rubricPagination.perPage
    }
    if (rubricFilters.name) queryParams.name = rubricFilters.name

    const route = Endpoints.admin.oscePractice + "/rubrics"
    const response = await getWithToken(route, queryParams)

    const rubrics = response.data.data || []
    const paginationData = response.data.pagination

    dispatch(setRubrics(rubrics))
    if (paginationData) {
      dispatch(updateRubricPagination(paginationData))
    }
  } finally {
    dispatch(setLoading({ key: "isGetListRubricsLoading", value: false }))
  }
}

export const fetchOsceRubric = (rubricId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: "isGetRubricDetailLoading", value: true }))

    const route = Endpoints.admin.oscePractice + "/rubrics" + `/${rubricId}`
    const response = await getWithToken(route)

    const rubric = response.data.data
    dispatch(setRubricDetail(rubric))
    if (onSuccess) onSuccess()
    return rubric
  } finally {
    dispatch(setLoading({ key: "isGetRubricDetailLoading", value: false }))
  }
}

export const createOsceRubric = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: "isCreatingRubric", value: true }))

    const route = Endpoints.admin.oscePractice + "/rubrics"
    const response = await postWithToken(route, data)

    if (onSuccess) onSuccess()
    dispatch(fetchAdminOsceRubrics())
    return response.data.data
  } finally {
    dispatch(setLoading({ key: "isCreatingRubric", value: false }))
  }
}

export const updateOsceRubric = (rubricId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: "isUpdatingRubric", value: true }))

    const route = Endpoints.admin.oscePractice + "/rubrics" + `/${rubricId}`
    const response = await putWithToken(route, data)

    if (onSuccess) onSuccess()
    dispatch(fetchAdminOsceRubrics())
    return response.data.data
  } finally {
    dispatch(setLoading({ key: "isUpdatingRubric", value: false }))
  }
}

export const deleteOsceRubric = (rubricId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: "isDeletingRubric", value: true }))

    const route = Endpoints.admin.oscePractice + "/rubrics" + `/${rubricId}`
    const response = await deleteWithToken(route)

    if (onSuccess) onSuccess()
    dispatch(fetchAdminOsceRubrics())
    return response.data
  } finally {
    dispatch(setLoading({ key: "isDeletingRubric", value: false }))
  }
}


// Fetch all rubrics for dropdowns (no pagination)
export const fetchAllRubrics = () => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isFetchingAllRubrics', value: true }))

    const route = Endpoints.admin.oscePractice + "/rubrics?perPage=1000"
    const response = await getWithToken(route)

    const rubrics = response.data.data || []
    dispatch(setAllRubrics(rubrics))
    return rubrics
  } finally {
    dispatch(setLoading({ key: 'isFetchingAllRubrics', value: false }))
  }
}
