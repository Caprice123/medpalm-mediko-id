import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, downloadWithToken } from '@utils/requestUtils'

const { setCards, setPagination, setLoading } = actions

export const fetchNodeCards = (nodeId, overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingCards: true }))
    const { pagination } = getState().nodeCards
    const page = overrides.page ?? pagination.page
    const res = await getWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards`, {
      page,
      perPage: pagination.perPage,
    })
    dispatch(setCards(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingCards: false }))
  }
}

export const addNodeCard = (nodeId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAddingCard: true }))
    await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAddingCard: false }))
  }
}

export const updateNodeCard = (nodeId, cardId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdatingCard: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingCard: false }))
  }
}

export const deleteNodeCard = (nodeId, cardId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeletingCard: true }))
    await deleteWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingCard: false }))
  }
}

export const moveNodeCard = (nodeId, cardId, targetNodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isMovingCard: true }))
    await putWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/${cardId}/move`, { targetNodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isMovingCard: false }))
  }
}

export const importNodeCards = (nodeId, file, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isImportingCards: true }))
    const formData = new FormData()
    formData.append('file', file)
    const res = await postWithToken(`${Endpoints.admin.featureNodes}/${nodeId}/cards/import`, formData)
    onSuccess?.(res.data.data)
  } finally {
    dispatch(setLoading({ isImportingCards: false }))
  }
}

export const downloadCardsTemplate = () => async () => {
  const res = await downloadWithToken(`${Endpoints.admin.featureNodes}/cards/template`)
  const url = URL.createObjectURL(new Blob([res.data]))
  const a = document.createElement('a')
  a.href = url
  a.download = 'template-kartu-flashcard.xlsx'
  a.click()
  URL.revokeObjectURL(url)
}
