import { actions } from '@store/summaryNotes/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setNotes,
  setDetail,
  setPagination,
  setEmbeddings,
  setSelectedEmbedding,
  setEmbeddingsPagination,
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

    // Add pagination parameters
    queryParams.page = currentPage
    queryParams.perPage = currentPerPage

    const response = await getWithToken(Endpoints.summaryNotes.list, queryParams)
    dispatch(setNotes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 12, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isNotesLoading', value: false }))
  }
}

export const startSummaryNoteSession = (userLearningSessionId, summaryNoteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingSession', value: true }))

    const response = await postWithToken(Endpoints.summaryNotes.start, {
      userLearningSessionId,
      summaryNoteId
    })

    const result = response.data.data
    dispatch(setDetail(result))
    return result
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isStartingSession', value: false }))
  }
}

export const fetchSummaryNoteSession = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSessionLoading', value: true }))

    const response = await getWithToken(Endpoints.summaryNotes.session(sessionId))
    const session = response.data.data
    dispatch(setDetail(session))
    return session
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSessionLoading', value: false }))
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
    if (currentFilters.status) queryParams.status = currentFilters.status

    // Add pagination parameters
    queryParams.page = currentPage
    queryParams.perPage = currentPerPage

    const response = await getWithToken(Endpoints.summaryNotes.admin.list, queryParams)
    dispatch(setNotes(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 30, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: false }))
  }
}

export const fetchSummaryNoteDetail = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: true }))

    const response = await getWithToken(Endpoints.summaryNotes.admin.detail(noteId))
    const note = response.data.data
    dispatch(setDetail(note))
    return note
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: false }))
  }
}

export const createSummaryNote = (noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreating', value: true }))

    const response = await postWithToken(Endpoints.summaryNotes.admin.list, noteData)
    const note = response.data.data
    return note
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCreating', value: false }))
  }
}

export const updateSummaryNote = (noteId, noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdating', value: true }))

    const response = await putWithToken(Endpoints.summaryNotes.admin.detail(noteId), noteData)
    const note = response.data.data
    return note
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isUpdating', value: false }))
  }
}

export const deleteSummaryNote = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleting', value: true }))

    await deleteWithToken(Endpoints.summaryNotes.admin.detail(noteId))
  } catch (err) {
    handleApiError(err, dispatch)
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
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

export const generateSummaryFromDocument = (blobId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))
    

    const response = await postWithToken(Endpoints.summaryNotes.admin.generate, { blobId })
    const result = response.data.data
    return result
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isGenerating', value: false }))
  }
}

// ============= Constants Endpoints =============

export const fetchSummaryNotesConstants = (keys) => async (dispatch) => {
  try {
    const queryParams = { keys: keys.join(',') }
    const response = await getWithToken(Endpoints.summaryNotes.admin.list.replace('/summary-notes', '/constants'), queryParams)
    return response.data.data || {}
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

export const updateSummaryNotesConstants = (settings) => async (dispatch) => {
  try {
    const response = await putWithToken(
      Endpoints.summaryNotes.admin.list.replace('/summary-notes', '/constants'),
      settings
    )
    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// ============= ChromaDB Embeddings Endpoints =============

export const fetchEmbeddings = (page, perPage) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isEmbeddingsLoading', value: true }))
    

    const queryParams = {
      page: page || 1,
      perPage: perPage || 20
    }

    const response = await getWithToken(Endpoints.summaryNotes.admin.embeddings, queryParams)
    dispatch(setEmbeddings(response.data.data || []))
    dispatch(setEmbeddingsPagination(response.data.pagination || { page: 1, perPage: 20, totalCount: 0, totalPages: 0, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isEmbeddingsLoading', value: false }))
  }
}

export const fetchEmbeddingDetail = (embeddingId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isEmbeddingDetailLoading', value: true }))
    

    const response = await getWithToken(Endpoints.summaryNotes.admin.embeddingDetail(embeddingId))
    const embedding = response.data.data
    dispatch(setSelectedEmbedding(embedding))
    return embedding
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isEmbeddingDetailLoading', value: false }))
  }
}

// Export actions for direct use
export { actions }
