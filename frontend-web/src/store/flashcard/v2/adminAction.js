import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'

export const attachSourcePdf = (uniqueId, blobId) => async () => {
  await postWithToken(`${Endpoints.admin.flashcardsV2}/${uniqueId}/source-pdf`, { blobId })
}

const { setLoading, setDecks, appendDecks, setDetail, updatePagination } = actions

export const fetchV2Decks = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: true }))
    const { filters, pagination } = getState().flashcard
    const params = { page: pagination.page, perPage: pagination.perPage }
    if (filters.search) params.search = filters.search
    if (filters.topic) params.topic = filters.topic
    if (filters.department) params.department = filters.department
    const response = await getWithToken(Endpoints.admin.flashcardsV2, params)
    const data = response.data.data || []
    if (pagination.page === 1) {
      dispatch(setDecks(data))
    } else {
      dispatch(appendDecks(data))
    }
    if (response.data.pagination) dispatch(updatePagination(response.data.pagination))
  } finally {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: false }))
  }
}

export const fetchV2Deck = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: true }))
    const response = await getWithToken(`${Endpoints.admin.flashcardsV2}/${uniqueId}`)
    dispatch(setDetail(response.data.data))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: false }))
  }
}

export const createV2Deck = (payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingDeck', value: true }))
    const response = await postWithToken(Endpoints.admin.flashcardsV2, payload)
    onSuccess?.(response.data.data)
  } finally {
    dispatch(setLoading({ key: 'isCreatingDeck', value: false }))
  }
}

export const updateV2Deck = (uniqueId, payload, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: true }))
    await putWithToken(`${Endpoints.admin.flashcardsV2}/${uniqueId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDeck', value: false }))
  }
}

export const deleteV2Deck = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeletingDeck', value: true }))
    await deleteWithToken(`${Endpoints.admin.flashcardsV2}/${uniqueId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ key: 'isDeletingDeck', value: false }))
  }
}

export const fetchPublishedFlashcardDecks = (params = {}) => async () => {
  const res = await getWithToken(Endpoints.admin.flashcardsV2, { status: 'published', ...params })
  return res.data
}
