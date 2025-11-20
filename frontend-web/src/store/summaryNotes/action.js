import { actions } from '@store/summaryNotes/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setNotes,
  setNoteSession,
  setAdminNotes,
  setSelectedNote,
  setGeneratedContent,
  addNote,
  updateNote,
  removeNote,
  setPagination,
  setError,
  clearError
} = actions

// ============= User Endpoints =============

export const fetchSummaryNotes = (filters = {}, page = 1, perPage = 12) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isNotesLoading', value: true }))
    dispatch(clearError())

    const queryParams = { page, perPage }
    if (filters.search) queryParams.search = filters.search
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester

    const response = await getWithToken(Endpoints.summaryNotes.list, queryParams)
    dispatch(setNotes(response.data.data || []))

    if (response.data.pagination) {
      dispatch(setPagination({
        currentPage: response.data.pagination.page,
        perPage: response.data.pagination.perPage,
        isLastPage: response.data.pagination.isLastPage
      }))
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isNotesLoading', value: false }))
  }
}

export const startSummaryNoteSession = (userLearningSessionId, summaryNoteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingSession', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.summaryNotes.start, {
      userLearningSessionId,
      summaryNoteId
    })

    const result = response.data.data
    dispatch(setNoteSession(result))
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isStartingSession', value: false }))
  }
}

export const fetchSummaryNoteSession = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSessionLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.summaryNotes.session(sessionId))
    const session = response.data.data
    dispatch(setNoteSession(session))
    return session
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSessionLoading', value: false }))
  }
}

// ============= Admin Endpoints =============

export const fetchAdminSummaryNotes = (filters = {}, page = 1, perPage = 30) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: true }))
    dispatch(clearError())

    const queryParams = { page, perPage }
    if (filters.search) queryParams.search = filters.search
    if (filters.university) queryParams.university = filters.university
    if (filters.semester) queryParams.semester = filters.semester
    if (filters.status) queryParams.status = filters.status

    const response = await getWithToken(Endpoints.summaryNotes.admin.list, queryParams)
    dispatch(setAdminNotes(response.data.data || []))

    if (response.data.pagination) {
      dispatch(setPagination({
        currentPage: response.data.pagination.page,
        perPage: response.data.pagination.perPage,
        total: response.data.pagination.total,
        isLastPage: response.data.pagination.isLastPage
      }))
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: false }))
  }
}

export const fetchSummaryNoteDetail = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.summaryNotes.admin.detail(noteId))
    const note = response.data.data
    dispatch(setSelectedNote(note))
    return note
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isNoteDetailLoading', value: false }))
  }
}

export const createSummaryNote = (noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreating', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.summaryNotes.admin.list, noteData)
    const note = response.data.data
    dispatch(addNote(note))
    return note
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreating', value: false }))
  }
}

export const updateSummaryNote = (noteId, noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdating', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.summaryNotes.admin.detail(noteId), noteData)
    const note = response.data.data
    dispatch(updateNote(note))
    return note
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdating', value: false }))
  }
}

export const deleteSummaryNote = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDeleting', value: true }))
    dispatch(clearError())

    await deleteWithToken(Endpoints.summaryNotes.admin.detail(noteId))
    dispatch(removeNote(noteId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDeleting', value: false }))
  }
}

export const generateSummaryFromDocument = (file) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGenerating', value: true }))
    dispatch(clearError())

    const formData = new FormData()
    formData.append('document', file)

    const response = await postWithToken(Endpoints.summaryNotes.admin.generate, formData)
    const result = response.data.data
    dispatch(setGeneratedContent(result))
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
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
    throw err
  }
}

export const updateSummaryNotesConstants = (settings) => async (dispatch) => {
  try {
    const response = await putWithToken(
      Endpoints.summaryNotes.admin.list.replace('/summary-notes', '/constants'),
      { constants: settings }
    )
    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  }
}

// Export actions for direct use
export { actions }
