import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setModels, setPagination, setLoading } = actions

export const fetchUnlinkedAtlas = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingModels: true }))
    const { pagination } = getState().unlinkedAtlas
    const page = overrides.page ?? pagination.page
    const search = overrides.search ?? ''
    const res = await getWithToken(Endpoints.admin.atlasModelsUnlinked, { page, perPage: pagination.perPage, search })
    dispatch(setModels(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingModels: false }))
  }
}

export const deleteUnlinkedAtlas = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingModel: true }))
    await deleteWithToken(`${Endpoints.admin.atlasModelsUnlinked}/${uniqueId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingModel: false }))
  }
}

export const assignAtlasToNode = (uniqueId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAssigningModel: true }))
    await putWithToken(`${Endpoints.admin.atlasModelsUnlinked}/${uniqueId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAssigningModel: false }))
  }
}
