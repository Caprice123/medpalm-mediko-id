import { actions } from '@store/flashcard/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '../../../utils/requestUtils'

const { setLoading, setDecks, appendDecks, setDetail, updatePagination,
  setLinkedMcq, appendLinkedMcq, setLinkedSummaryNotes, appendLinkedSummaryNotes } = actions

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

export const fetchLinkedMcq = (uniqueId, page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLinkedMcqLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.flashcardsV2}/${uniqueId}/content-relations`, { targetType: 'mcq_topic', page, perPage: 6 })
    const payload = { data: response.data.data || [], pagination: response.data.pagination }
    if (page === 1) dispatch(setLinkedMcq(payload))
    else dispatch(appendLinkedMcq(payload))
  } finally {
    dispatch(setLoading({ key: 'isLinkedMcqLoading', value: false }))
  }
}

export const fetchLinkedSummaryNotes = (uniqueId, page = 1) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLinkedSummaryNotesLoading', value: true }))
    const response = await getWithToken(`${Endpoints.api.flashcardsV2}/${uniqueId}/content-relations`, { targetType: 'summary_note', page, perPage: 6 })
    const payload = { data: response.data.data || [], pagination: response.data.pagination }
    if (page === 1) dispatch(setLinkedSummaryNotes(payload))
    else dispatch(appendLinkedSummaryNotes(payload))
  } finally {
    dispatch(setLoading({ key: 'isLinkedSummaryNotesLoading', value: false }))
  }
}
