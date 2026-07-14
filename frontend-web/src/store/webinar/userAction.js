import { actions } from '@store/webinar/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setWebinars,
  setPagination,
  setDetail,
  setMyRegistrations,
} = actions

export const fetchWebinars = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))

    const { filter, pagination } = getState().webinar
    const queryParams = {
      page: pagination.page,
      perPage: overrides.perPage ?? pagination.perPage,
    }
    if (filter.search) queryParams.search = filter.search
    if (filter.registrationStatus && filter.registrationStatus !== 'all') queryParams.registrationStatus = filter.registrationStatus

    const response = await getWithToken(Endpoints.api.webinars, queryParams)
    dispatch(setWebinars(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const fetchWebinarDetail = (uniqueId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.webinars}/${uniqueId}`)
    dispatch(setDetail(response.data.data))
    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const registerWebinar = (uniqueId, blobIds, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isRegisterLoading', value: true }))
    await postWithToken(`${Endpoints.api.webinars}/${uniqueId}/register`, { blobIds })
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isRegisterLoading', value: false }))
  }
}

export const fetchMyRegistrations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetMyRegistrationsLoading', value: true }))
    const { pagination } = getState().webinar
    const response = await getWithToken(`${Endpoints.api.webinars}/my-registrations`, {
      page: pagination.page,
      perPage: pagination.perPage,
    })
    dispatch(setMyRegistrations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetMyRegistrationsLoading', value: false }))
  }
}
