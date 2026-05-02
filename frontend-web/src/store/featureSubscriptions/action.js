import { actions } from '@store/featureSubscriptions/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, patchWithToken, deleteWithToken } from '../../utils/requestUtils'

const { setLoading, setItems, setPagination, updateItem, removeItem } = actions

export const fetchFeatureSubscriptions = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isFetchLoading', value: true }))
    const { feature, isActive, search } = getState().featureSubscriptions.filter
    const { page, perPage } = getState().featureSubscriptions.pagination

    const params = { page, perPage }
    if (feature) params.feature = feature
    if (isActive !== undefined && isActive !== null) params.isActive = isActive
    if (search) params.search = search

    const response = await getWithToken(Endpoints.admin.featureSubscriptions, params)
    const { items, isLastPage } = response.data.data
    dispatch(setItems(items))
    dispatch(setPagination({ page, perPage, isLastPage }))
  } finally {
    dispatch(setLoading({ key: 'isFetchLoading', value: false }))
  }
}

export const createFeatureSubscription = ({ userId, feature, isActive }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreateLoading', value: true }))
    await postWithToken(Endpoints.admin.featureSubscriptions, { userId, feature, isActive })
    if (onSuccess) onSuccess()
    dispatch(fetchFeatureSubscriptions())
  } finally {
    dispatch(setLoading({ key: 'isCreateLoading', value: false }))
  }
}

export const updateFeatureSubscription = (id, { isActive }, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdateLoading', value: true }))
    const response = await patchWithToken(`${Endpoints.admin.featureSubscriptions}/${id}`, { isActive })
    dispatch(updateItem(response.data.data))
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isUpdateLoading', value: false }))
  }
}

export const deleteFeatureSubscription = (id, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleteLoading', value: true }))
    await deleteWithToken(`${Endpoints.admin.featureSubscriptions}/${id}`)
    dispatch(removeItem(id))
    if (onSuccess) onSuccess()
  } finally {
    dispatch(setLoading({ key: 'isDeleteLoading', value: false }))
  }
}
