import { actions } from '@store/webinar/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setWebinars,
  setPagination,
  setDetail,
  setRegistrations,
  setRegistrationPagination,
} = actions

export const fetchAdminWebinars = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))

    const { filter, pagination } = getState().webinar
    const queryParams = { page: pagination.page, perPage: pagination.perPage }
    if (filter.search) queryParams.search = filter.search
    if (filter.status) queryParams.status = filter.status

    const response = await getWithToken(Endpoints.admin.webinars, queryParams)
    dispatch(setWebinars(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const fetchAdminWebinar = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.webinars}/${uniqueId}`)
    const webinar = response.data.data
    dispatch(setDetail(webinar))
    if (onSuccess) onSuccess(webinar)
    return webinar
  } finally {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const createWebinar = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateLoading', value: true }))
    await postWithToken(Endpoints.admin.webinars, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateLoading', value: false }))
  }
}

export const updateWebinar = (uniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    await putWithToken(`${Endpoints.admin.webinars}/${uniqueId}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}

export const deleteWebinar = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteLoading', value: true }))
    await deleteWithToken(`${Endpoints.admin.webinars}/${uniqueId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteLoading', value: false }))
  }
}

export const fetchAllWebinarRegistrations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: true }))
    const { registrationFilter, registrationPagination } = getState().webinar
    const queryParams = {
      page: registrationPagination.page,
      perPage: registrationPagination.perPage,
    }
    if (registrationFilter?.status) queryParams.status = registrationFilter.status
    if (registrationFilter?.search) queryParams.search = registrationFilter.search
    if (registrationFilter?.webinarId) queryParams.webinarId = registrationFilter.webinarId

    const response = await getWithToken(`${Endpoints.admin.webinars}/registrations`, queryParams)
    dispatch(setRegistrations(response.data.data || []))
    dispatch(setRegistrationPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: false }))
  }
}

export const fetchWebinarRegistrations = (webinarUniqueId, params = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: true }))
    const { registrationPagination } = getState().webinar
    const queryParams = {
      page: params.page || registrationPagination.page,
      perPage: params.perPage || registrationPagination.perPage,
    }
    if (params.status) queryParams.status = params.status

    const response = await getWithToken(
      `${Endpoints.admin.webinars}/${webinarUniqueId}/registrations`,
      queryParams
    )
    dispatch(setRegistrations(response.data.data || []))
    dispatch(setRegistrationPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetRegistrationsLoading', value: false }))
  }
}

export const reviewRegistration = (registrationUniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isReviewLoading', value: true }))
    await putWithToken(
      `${Endpoints.admin.webinars}/registrations/${registrationUniqueId}/review`,
      data
    )
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isReviewLoading', value: false }))
  }
}
