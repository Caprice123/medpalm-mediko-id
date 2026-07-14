import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '@utils/requestUtils'
import { upload } from '@store/common/action'

const { setLoading, setNotes, appendNotes, setDetail, setPagination } = actions

export const fetchAdminSummaryNotesV2 = (overrides = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ isAdminNotesLoading: true }))

    const queryParams = {}
    queryParams.page = overrides.page ?? 1
    queryParams.perPage = overrides.perPage ?? 50

    if (overrides.nodeId !== undefined) queryParams.nodeId = overrides.nodeId
    if (overrides.unassigned) queryParams.unassigned = 'true'
    if (overrides.search) queryParams.search = overrides.search
    if (overrides.status) queryParams.status = overrides.status

    const response = await getWithToken(Endpoints.admin.summaryNotesV2Admin, queryParams)
    if (overrides.append) {
      dispatch(appendNotes(response.data.data || []))
    } else {
      dispatch(setNotes(response.data.data || []))
    }
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 50, isLastPage: false }))
  } finally {
    dispatch(setLoading({ isAdminNotesLoading: false }))
  }
}

export const fetchAdminSummaryNoteDetailV2 = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ isNoteDetailLoading: true }))
    const response = await getWithToken(`${Endpoints.admin.summaryNotesV2Admin}/${noteId}`)
    const note = response.data.data
    dispatch(setDetail(note))
    return note
  } finally {
    dispatch(setLoading({ isNoteDetailLoading: false }))
  }
}

export const createSummaryNoteV2 = (noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ isCreating: true }))
    const response = await postWithToken(Endpoints.admin.summaryNotesV2Admin, noteData)
    return response.data.data
  } finally {
    dispatch(setLoading({ isCreating: false }))
  }
}

export const updateSummaryNoteV2 = (noteId, noteData) => async (dispatch) => {
  try {
    dispatch(setLoading({ isUpdating: true }))
    const response = await putWithToken(`${Endpoints.admin.summaryNotesV2Admin}/${noteId}`, noteData)
    return response.data.data
  } finally {
    dispatch(setLoading({ isUpdating: false }))
  }
}

export const deleteSummaryNoteV2 = (noteId) => async (dispatch) => {
  try {
    dispatch(setLoading({ isDeleting: true }))
    await deleteWithToken(`${Endpoints.admin.summaryNotesV2Admin}/${noteId}`)
  } finally {
    dispatch(setLoading({ isDeleting: false }))
  }
}

export const generateSummaryFromDocumentV2 = (blobId) => async (dispatch) => {
  try {
    dispatch(setLoading({ isGenerating: true }))
    const response = await postWithToken(`${Endpoints.admin.summaryNotesV2Admin}/generate`, { blobId })
    return response.data.data
  } finally {
    dispatch(setLoading({ isGenerating: false }))
  }
}

export { upload }
