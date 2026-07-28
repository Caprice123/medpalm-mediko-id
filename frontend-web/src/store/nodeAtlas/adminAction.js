import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setModels, setPagination, setLoading } = actions

export const fetchNodeAtlasModels = (nodeId, overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingModels: true }))
    const { pagination } = getState().nodeAtlas
    const page = overrides.page ?? pagination.page
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models`, {
      page,
      perPage: pagination.perPage,
    })
    dispatch(setModels(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingModels: false }))
  }
}

export const unlinkNodeAtlasModel = (nodeId, modelId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUnlinkingModel: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models/${modelId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUnlinkingModel: false }))
  }
}

export const updateNodeAtlasModel = (uniqueId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingModel: true }))
    await putWithToken(`${Endpoints.admin.atlasV2}/${uniqueId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingModel: false }))
  }
}

export const moveNodeAtlasModel = (nodeId, modelId, targetNodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isMovingModel: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models/${modelId}/move`, { targetNodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isMovingModel: false }))
  }
}
