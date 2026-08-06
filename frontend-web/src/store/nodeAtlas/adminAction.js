import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setModels, appendModels, setPagination, setLoading } = actions

export const fetchNodeAtlasModels = (nodeId, { append = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingModels: true }))
    const { pagination } = getState().nodeAtlas
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models`, {
      page: pagination.page,
      perPage: pagination.perPage,
    })
    dispatch(append ? appendModels(res.data.data || []) : setModels(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingModels: false }))
  }
}

export const loadMoreNodeAtlasModels = (nodeId) => (dispatch, getState) => {
  const { pagination } = getState().nodeAtlas
  if (pagination.isLastPage) return
  dispatch(setPagination({ page: pagination.page + 1 }))
  dispatch(fetchNodeAtlasModels(nodeId, { append: true }))
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

// atlas model ordering within a node — swaps two siblings' order directly
export const swapAtlasModelOrder = (nodeId, modelId, withModelId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isSwappingOrder: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/atlas-models/${modelId}/swap-order`, { withModelId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isSwappingOrder: false }))
  }
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

// feature_node (subtopic) ↔ atlas model content_relations — fire-and-return, no Redux state
export const fetchNodeAtlasRelations = (slug) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelationsV2, {
    sourceType: 'feature_node', sourceUniqueId: slug, targetType: 'atlas_model',
  })
  return res.data.data || []
}

export const addNodeAtlasRelation = (slug, atlasUniqueId) => async () => {
  await postWithToken(Endpoints.admin.contentRelationsV2, {
    sourceType: 'feature_node', sourceUniqueId: slug, targetType: 'atlas_model', targetUniqueId: atlasUniqueId,
  })
}

export const removeNodeAtlasRelation = (relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelationsV2}/${relationId}`)
}
