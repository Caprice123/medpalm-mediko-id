import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '../../../utils/requestUtils'

const { setLoading, setDecks, appendDecks, setDetail, updatePagination } = actions

export const fetchV2UserDecks = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: true }))
    const { filters, pagination } = getState().flashcard
    const params = { page: pagination.page, perPage: pagination.perPage }
    if (filters.search) params.search = filters.search
    if (filters.topic) params.topic = filters.topic
    if (filters.department) params.department = filters.department
    const response = await getWithToken(Endpoints.api.flashcardsV2, params)
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

export const fetchV2UserDeck = (uniqueId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.flashcardsV2}/${uniqueId}`)
    dispatch(setDetail(response.data.data))
    onSuccess?.()
  } finally {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: false }))
  }
}
