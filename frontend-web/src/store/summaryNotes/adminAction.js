import { actions } from '@store/summaryNotes/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setNotes,
  appendNotes,
  setDetail,
  setPagination,
} = actions

// ============= Admin Endpoints =============

/**
 * Fetch summary notes for admin panel.
 * Pass overrides = { status, page, perPage, append } to customise without touching filter Redux state.
 */
export const fetchAdminSummaryNotes = (overrides = {}) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isAdminNotesLoading', value: true }))

    const state = getState().summaryNotes
    const currentFilters = state.filters

    const queryParams = {}
    const activeStatus = overrides.status ?? currentFilters.status
    if (activeStatus) queryParams.status = activeStatus
    if (!overrides.status) {
      if (currentFilters.search) queryParams.search = currentFilters.search
      if (currentFilters.university) queryParams.university = currentFilters.university
      if (currentFilters.semester) queryParams.semester = currentFilters.semester
      if (currentFilters.department) queryParams.department = currentFilters.department
    }
    queryParams.page = overrides.page ?? state.pagination.page
    queryParams.perPage = overrides.perPage ?? state.pagination.perPage

    // V2 folder/search overrides — take priority over filter state
    if (overrides.nodeId !== undefined) queryParams.nodeId = overrides.nodeId
    if (overrides.unassigned) queryParams.unassigned = 'true'
    if ('search' in overrides) {
      if (overrides.search) queryParams.search = overrides.search
      else delete queryParams.search
    }
    if ('status' in overrides && overrides.status) queryParams.status = overrides.status

    const route = Endpoints.admin.summaryNotes
    const response = await getWithToken(route, queryParams)
    if (overrides.append) {
      dispatch(appendNotes(response.data.data || []))
    } else {
      dispatch(setNotes(response.data.data || []))
    }
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

export const uploadDocument = (file) => async () => {
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
      url: result.url,
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

// ── Content Relations ──

export const fetchSummaryNoteRelations = (noteId) => async () => {
  const res = await getWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'summary_note',
    sourceId: noteId,
  })
  return res.data.data || []
}

export const addSummaryNoteRelation = (sourceId, targetType, targetId) => async () => {
  await postWithToken(Endpoints.admin.contentRelations, {
    sourceType: 'summary_note',
    sourceId,
    targetType,
    targetId,
  })
}

export const removeSummaryNoteRelation = (relationId) => async () => {
  await deleteWithToken(`${Endpoints.admin.contentRelations}/${relationId}`)
}
