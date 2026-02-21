import { actions } from '@store/summaryNotes/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setNotes,
  setDetail,
  setPagination,
} = actions

// ============= User Endpoints =============

export const fetchSummaryNotes = (filters, page, perPage) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isNotesLoading', value: true }))

    const state = getState().summaryNotes
    const currentFilters = filters || state.filters
    const currentPage = page || state.pagination.page
    const currentPerPage = perPage || state.pagination.perPage

    const queryParams = {}
    if (currentFilters.search) queryParams.search = currentFilters.search
    if (currentFilters.university) queryParams.university = currentFilters.university
    if (currentFilters.semester) queryParams.semester = currentFilters.semester
    if (currentFilters.topic) queryParams.topic = currentFilters.topic
    if (currentFilters.department) queryParams.department = currentFilters.department

    queryParams.page = currentPage
    queryParams.perPage = currentPerPage

    const response = await getWithToken(Endpoints.api.summaryNotes, queryParams)
    dispatch(setNotes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 12, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isNotesLoading', value: false }))
  }
}

export const fetchUserSummaryNoteDetail = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: true }))

    const route = Endpoints.api.summaryNotes + `/${noteId}`
    const response = await getWithToken(route)
    const note = response.data.data
    dispatch(setDetail(note))
    return note
  } finally {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: false }))
  }
}
