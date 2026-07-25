import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'

const { setCards, setPagination, setLoading } = actions

export const fetchUnlinkedCards = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isFetchingCards: true }))
    const { pagination } = getState().unlinkedCards
    const page = overrides.page ?? pagination.page
    const search = overrides.search ?? ''
    const res = await getWithToken(Endpoints.admin.flashcardCardsUnlinked, { page, perPage: pagination.perPage, search })
    dispatch(setCards(res.data.data || []))
    if (res.data.pagination) dispatch(setPagination(res.data.pagination))
  } finally {
    dispatch(setLoading({ isFetchingCards: false }))
  }
}

export const updateUnlinkedCard = (cardId, payload, onSuccess) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isUpdatingCard: true }))
    await putWithToken(`${Endpoints.admin.flashcardCardsUnlinked}/${cardId}`, payload)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isUpdatingCard: false }))
  }
}

export const deleteUnlinkedCard = (cardId, onSuccess) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ isDeletingCard: true }))
    await deleteWithToken(`${Endpoints.admin.flashcardCardsUnlinked}/${cardId}`)
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isDeletingCard: false }))
  }
}

export const assignCardToNode = (cardId, nodeId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAssigningCard: true }))
    await putWithToken(`${Endpoints.admin.flashcardCardsUnlinked}/${cardId}/assign`, { nodeId })
    onSuccess?.()
  } finally {
    dispatch(setLoading({ isAssigningCard: false }))
  }
}
