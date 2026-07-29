import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

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

// fire-and-return — for the atlas link picker
export const fetchAtlasModelsForNode = (nodeId) => async () => {
  const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models`, { page: 1, perPage: 100 })
  return res.data.data || []
}

// atlas model content_relations — fire-and-return, no Redux state
export const fetchAtlasModelRelations = (uniqueId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'atlas_model', sourceUniqueId: uniqueId, targetType: 'atlas_model' })
  return res.data.data || []
}

export const addAtlasModelRelation = (uniqueId, targetUniqueId, relationType = '') => async () => {
  const res = await postWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'atlas_model', sourceUniqueId: uniqueId, targetType: 'atlas_model', targetUniqueId, relationType })
  return res.data.data
}

export const removeAtlasModelRelation = (uniqueId, relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelationsV2}/${relationId}`)
}

// atlas model → anatomy quiz explicit links — fire-and-return, no Redux state
export const fetchAtlasModelQuizRelations = (uniqueId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'atlas_model', sourceUniqueId: uniqueId, targetType: 'anatomy_quiz' })
  return res.data.data || []
}

export const addAtlasModelQuizRelation = (uniqueId, targetUniqueId) => async () => {
  await postWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'atlas_model', sourceUniqueId: uniqueId, targetType: 'anatomy_quiz', targetUniqueId, relationType: 'feature_relation' })
}

export const removeAtlasModelQuizRelation = (uniqueId, relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelationsV2}/${relationId}`)
}
