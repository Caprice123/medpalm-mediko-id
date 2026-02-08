import { actions } from '@store/summaryNotes/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

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

    // If no parameters provided, get from state
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

    // Add pagination parameters
    queryParams.page = currentPage
    queryParams.perPage = currentPerPage

    const response = await getWithToken(Endpoints.api.summaryNotes, queryParams)
    dispatch(setNotes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 12, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isNotesLoading', value: false }))
  }
}

/**
 * User-facing: Fetch single summary note detail
 * Uses public API endpoint
 */
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

// ============= Admin Endpoints =============

export const fetchAdminSummaryNotes = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: true }))

    // If no parameters provided, get from state
    const state = getState().summaryNotes
    const currentFilters = state.filters
    const currentPage = state.pagination.page
    const currentPerPage = state.pagination.perPage

    const queryParams = {}
    if (currentFilters.search) queryParams.search = currentFilters.search
    if (currentFilters.university) queryParams.university = currentFilters.university
    if (currentFilters.semester) queryParams.semester = currentFilters.semester
    if (currentFilters.topic) queryParams.topic = currentFilters.topic
    if (currentFilters.department) queryParams.department = currentFilters.department
    if (currentFilters.status) queryParams.status = currentFilters.status

    // Add pagination parameters
    queryParams.page = currentPage
    queryParams.perPage = currentPerPage

    const route = Endpoints.admin.summaryNotes
    const response = await getWithToken(route, queryParams)
    dispatch(setNotes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 30, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: false }))
  }
}

export const fetchSummaryNoteDetail = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: true }))
    
    const route = Endpoints.admin.summaryNotes + `/${noteId}`
    const response = await getWithToken(route)
    const note = response.data.data
    dispatch(setDetail(note))
    return note
  } finally {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: false }))
  }
}

export const createSummaryNote = (noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreating', value: true }))
    
    const route = Endpoints.admin.summaryNotes
    const response = await postWithToken(route, noteData)
    const note = response.data.data
    return note
  } finally {
    dispatch(setLoading({ key: 'isCreating', value: false }))
  }
}

export const updateSummaryNote = (noteId, noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdating', value: true }))

    const route = Endpoints.admin.summaryNotes + `/${noteId}`
    const response = await putWithToken(route, noteData)
    const note = response.data.data
    return note
  } finally {
    dispatch(setLoading({ key: 'isUpdating', value: false }))
  }
}

export const deleteSummaryNote = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleting', value: true }))

    const route = Endpoints.admin.summaryNotes + `/${noteId}`
    await deleteWithToken(route)
  } finally {
    dispatch(setLoading({ key: 'isDeleting', value: false }))
  }
}

export const uploadDocument = (file) => async (dispatch) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'summary_note')

    const response = await postWithToken(Endpoints.api.uploadImage, formData)
    const result = response.data.data

    return {
      blobId: result.blobId,
      filename: result.filename,
      contentType: result.contentType,
      byteSize: result.byteSize,
      url: result.url // Presigned URL for viewing
    }
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

export const generateSummaryFromDocument = (blobId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))
    
    const route = Endpoints.admin.summaryNotes + '/generate'
    const response = await postWithToken(route, { blobId })
    const result = response.data.data
    return result
  } finally {
    dispatch(setLoading({ key: 'isGenerating', value: false }))
  }
}

// Export actions for direct use
export { actions }
