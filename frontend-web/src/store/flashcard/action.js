import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setDecks,
  setDetail,
  updatePagination,
} = actions

// ============= Decks Actions =============

/**
 * Fetch all flashcard decks (user endpoint)
 */
export const fetchFlashcardDecks = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: true }))

    const { filters, pagination } = getState().flashcard
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const route = Endpoints.api.flashcards
    const response = await getWithToken(route, queryParams)

    const decks = response.data.data || []
    const paginationData = response.data.pagination

    dispatch(setDecks(decks))
    if (paginationData) {
      dispatch(updatePagination(paginationData))
    }
  } finally {
    dispatch(setLoading({ key: 'isGetListDecksLoading', value: false }))
  }
}

export const fetchFlashcardDeck = (deckId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: true }))

    const route = Endpoints.admin.flashcards + `/${deckId}`
    const response = await getWithToken(route)

    const deck = response.data.data || response.data.deck
    dispatch(setDetail(deck))
    if (onSuccess) onSuccess()
    return deck
  } finally {
    dispatch(setLoading({ key: 'isGetDetailFlashcardDeckLoading', value: false }))
  }
}
