import { actions } from '@store/event/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken } from '@utils/requestUtils'

const { setLoading, setEvents, setPagination, setMyRegistrations } = actions

export const fetchEvents = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))
    const { filter, pagination } = getState().event
    const queryParams = {
      page: pagination.page,
      perPage: overrides.perPage ?? pagination.perPage,
    }
    if (filter.search) queryParams.search = filter.search
    if (filter.registrationStatus && filter.registrationStatus !== 'all') {
      queryParams.registrationStatus = filter.registrationStatus
    }
    const response = await getWithToken(Endpoints.api.events, queryParams)
    dispatch(setEvents(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const registerEvent = (code, blobIds, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isRegisterLoading', value: true }))
    await postWithToken(`${Endpoints.api.events}/${code}/register`, { blobIds })
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isRegisterLoading', value: false }))
  }
}

export const fetchMyEventRegistrations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetMyRegistrationsLoading', value: true }))
    const { pagination } = getState().event
    const response = await getWithToken(`${Endpoints.api.events}/my-registrations`, {
      page: pagination.page,
      perPage: pagination.perPage,
    })
    dispatch(setMyRegistrations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetMyRegistrationsLoading', value: false }))
  }
}
