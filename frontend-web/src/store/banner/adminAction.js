import { actions } from '@store/banner/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setLoading, setBanners, setDetail, setPagination } = actions

export const fetchAdminBanners = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListLoading', value: true }))
    const { filter, pagination } = getState().banner
    const queryParams = { page: pagination.page, perPage: pagination.perPage }
    if (filter.search) queryParams.search = filter.search

    const response = await getWithToken(Endpoints.admin.banners, queryParams)
    dispatch(setBanners(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isGetListLoading', value: false }))
  }
}

export const fetchAdminBanner = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.banners}/${uniqueId}`)
    const banner = response.data.data
    dispatch(setDetail(banner))
    if (onSuccess) onSuccess(banner)
    return banner
  } finally {
    dispatch(setLoading({ key: 'isGetDetailLoading', value: false }))
  }
}

export const createBanner = (data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateLoading', value: true }))
    await postWithToken(Endpoints.admin.banners, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isCreateLoading', value: false }))
  }
}

export const updateBanner = (uniqueId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    await putWithToken(`${Endpoints.admin.banners}/${uniqueId}`, data)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}

export const deleteBanner = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteLoading', value: true }))
    await deleteWithToken(`${Endpoints.admin.banners}/${uniqueId}`)
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteLoading', value: false }))
  }
}
