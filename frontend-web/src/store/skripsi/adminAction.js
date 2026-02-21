import { actions } from '@store/skripsi/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setSets,
  removeSet,
  setLoading,
  setPagination,
} = actions

// ============= Admin Sets Management =============

export const fetchAdminSets = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isSetsLoading', value: true }))

    const { filters, pagination } = getState().skripsi
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }

    if (filters?.search) queryParams.search = filters.search
    if (filters?.mode) queryParams.mode = filters.mode
    if (filters?.userId) queryParams.userId = filters.userId

    const route = Endpoints.admin.skripsi + "/sets"
    const response = await getWithToken(route, queryParams)

    dispatch(setSets(response.data.data || []))
    dispatch(setPagination(response.data.pagination || {}))

    return response.data
  } finally {
    dispatch(setLoading({ key: 'isSetsLoading', value: false }))
  }
}

export const fetchAdminSet = (setId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdminSetLoading', value: true }))

    const route = Endpoints.admin.skripsi + `/sets/${setId}`
    const response = await getWithToken(route)
    const set = response.data.data

    return set
  } finally {
    dispatch(setLoading({ key: 'isAdminSetLoading', value: false }))
  }
}

export const deleteAdminSet = (setId) => async (dispatch) => {
  try {
    const route = Endpoints.admin.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}
