import { actions } from '@store/atlas/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const {
  setLoading,
  setModels,
  setPagination,
  setDetail,
} = actions

export const fetchAdminAtlasModels = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListAtlasLoading', value: true }))

    const { filter, pagination } = getState().atlas

    const queryParams = {}
    if (filter.university) queryParams.university = filter.university
    if (filter.semester) queryParams.semester = filter.semester
    if (filter.status) queryParams.status = filter.status
    if (filter.search) queryParams.search = filter.search

    queryParams.page = pagination.page
    queryParams.perPage = pagination.perPage

    const route = Endpoints.admin.atlas
    const response = await getWithToken(route, queryParams)

    dispatch(setModels(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListAtlasLoading', value: false }))
  }
}

export const fetchAdminAtlasModel = (modelId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailAtlasLoading', value: true }))

    const route = Endpoints.admin.atlas + `/${modelId}`
    const response = await getWithToken(route)

    const model = response.data.data
    dispatch(setDetail(model))
    if (onSuccess) onSuccess(model)
    return model
  } finally {
    dispatch(setLoading({ key: 'isGetDetailAtlasLoading', value: false }))
  }
}

export const createAtlasModel = (modelData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateAtlasLoading', value: true }))

    const route = Endpoints.admin.atlas
    await postWithToken(route, modelData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateAtlasLoading', value: false }))
  }
}

export const updateAtlasModel = (modelId, modelData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateAtlasLoading', value: true }))

    const route = Endpoints.admin.atlas + `/${modelId}`
    await putWithToken(route, modelData)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateAtlasLoading', value: false }))
  }
}

export const deleteAtlasModel = (modelId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteAtlasLoading', value: true }))

    const route = Endpoints.admin.atlas + `/${modelId}`
    await deleteWithToken(route)

    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteAtlasLoading', value: false }))
  }
}
