import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setQuizzes, setPagination, setLoading } = actions

export const fetchNodeAnatomyQuizzes = (nodeId, overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingQuizzes: true }))
    const { pagination } = getState().nodeAnatomy
    const page = overrides.page ?? pagination.page
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/anatomy-quizzes`, {
      page,
      perPage: pagination.perPage,
    })
    dispatch(setQuizzes(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingQuizzes: false }))
  }
}

export const unlinkNodeAnatomyQuiz = (nodeId, quizId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUnlinkingQuiz: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/anatomy-quizzes/${quizId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUnlinkingQuiz: false }))
  }
}

export const updateNodeAnatomyQuiz = (uniqueId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingQuiz: true }))
    await putWithToken(`${Endpoints.admin.anatomyV2}/${uniqueId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingQuiz: false }))
  }
}

export const moveNodeAnatomyQuiz = (nodeId, quizId, targetNodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isMovingQuiz: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/anatomy-quizzes/${quizId}/move`, { targetNodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isMovingQuiz: false }))
  }
}

// fire-and-return — for the quiz link picker
export const fetchQuizzesForNode = (nodeId) => async () => {
  const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/anatomy-quizzes`, { page: 1, perPage: 100 })
  return res.data.data || []
}

// anatomy quiz content_relations — fire-and-return, no Redux state
export const fetchQuizRelations = (uniqueId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'anatomy_quiz', sourceUniqueId: uniqueId, targetType: 'anatomy_quiz' })
  return res.data.data || []
}

export const addQuizRelation = (uniqueId, targetUniqueId, relationType = '') => async () => {
  await postWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'anatomy_quiz', sourceUniqueId: uniqueId, targetType: 'anatomy_quiz', targetUniqueId, relationType })
}

export const removeQuizRelation = (uniqueId, relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelationsV2}/${relationId}`)
}

// anatomy quiz → atlas model explicit links — fire-and-return, no Redux state
export const fetchQuizAtlasRelations = (uniqueId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'anatomy_quiz', sourceUniqueId: uniqueId, targetType: 'atlas_model' })
  return res.data.data || []
}

export const addQuizAtlasRelation = (uniqueId, atlasUniqueId) => async () => {
  await postWithToken(Endpoints.admin.contentRelationsV2, { sourceType: 'anatomy_quiz', sourceUniqueId: uniqueId, targetType: 'atlas_model', targetUniqueId: atlasUniqueId, relationType: 'feature_relation' })
}

export const removeQuizAtlasRelation = (uniqueId, relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelationsV2}/${relationId}`)
}
