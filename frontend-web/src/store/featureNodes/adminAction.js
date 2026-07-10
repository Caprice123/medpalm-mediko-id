import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setNodes, setNodeRecords, setLoading } = actions

export const fetchFeatureNodes = (params = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingNodes: true }))
    const response = await getWithToken(Endpoints.admin.featureNodes, params)
    dispatch(setNodes(response.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingNodes: false }))
  }
}

export const createFeatureNode = (payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isCreating: true }))
    await postWithToken(Endpoints.admin.featureNodes, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isCreating: false }))
  }
}

export const updateFeatureNode = (id, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdating: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${id}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdating: false }))
  }
}

export const deleteFeatureNode = (id, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeleting: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${id}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeleting: false }))
  }
}

// Records
export const fetchNodeRecords = (recordType) => async (dispatch) => {
  try {
    dispatch(setLoading({ isFetchingRecords: true }))
    const response = await getWithToken(Endpoints.admin.featureNodeRecords, { recordType })
    dispatch(setNodeRecords(response.data.data || []))
  } finally {
    dispatch(setLoading({ isFetchingRecords: false }))
  }
}

export const createNodeRecord = (payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isCreatingRecord: true }))
    await postWithToken(Endpoints.admin.featureNodeRecords, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isCreatingRecord: false }))
  }
}

export const deleteNodeRecord = (id, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingRecord: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodeRecords}/${id}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingRecord: false }))
  }
}

export const autoLinkFlashcardDecks = (onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAutoLinking: true }))
    const response = await postWithToken(Endpoints.admin.autoLinkFlashcardDecks, {})
    onSuccess?.(response.data.data)
  } finally {
    dispatch(setLoading({ isAutoLinking: false }))
  }
}
