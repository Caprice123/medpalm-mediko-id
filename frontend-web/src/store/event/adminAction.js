import { actions } from '@store/event/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setEvents,
  setPagination,
  setDetail,
  setRegistrations,
  setRegistrationPagination,
} = actions

export const fetchRegistrationDetail = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.events}/registrations/${uniqueId}`)
    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const fetchAdminEvents = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))
    const { filter, pagination } = getState().event
    const queryParams = { page: pagination.page, perPage: pagination.perPage }
    if (filter.search) queryParams.search = filter.search
    if (filter.status) queryParams.status = filter.status

    const response = await getWithToken(Endpoints.admin.events, queryParams)
    dispatch(setEvents(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const fetchAdminEvent = (code, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.events}/${code}`)
    const event = response.data.data
    dispatch(setDetail(event))
    if (onSuccess) onSuccess(event)
    return event
  } finally {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const createEvent = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateLoading', value: true }))
    await postWithToken(Endpoints.admin.events, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateLoading', value: false }))
  }
}

export const updateEvent = (code, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    await putWithToken(`${Endpoints.admin.events}/${code}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}

export const deleteEvent = (code, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteLoading', value: true }))
    await deleteWithToken(`${Endpoints.admin.events}/${code}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteLoading', value: false }))
  }
}

export const fetchAllEventRegistrations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: true }))
    const { registrationFilter, registrationPagination } = getState().event
    const queryParams = {
      page: registrationPagination.page,
      perPage: registrationPagination.perPage,
    }
    if (registrationFilter?.status) queryParams.status = registrationFilter.status
    if (registrationFilter?.search) queryParams.search = registrationFilter.search
    if (registrationFilter?.eventId) queryParams.eventId = registrationFilter.eventId

    const response = await getWithToken(`${Endpoints.admin.events}/registrations`, queryParams)
    dispatch(setRegistrations(response.data.data || []))
    dispatch(setRegistrationPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: false }))
  }
}

export const reviewRegistration = (registrationUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isReviewLoading', value: true }))
    await putWithToken(`${Endpoints.admin.events}/registrations/${registrationUniqueId}/review`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isReviewLoading', value: false }))
  }
}
