import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

const NOTES_PER_PAGE = 20
const NODES_PER_PAGE = 30

// Returns { data, pagination } — for lazy tree loading
export const fetchLazyUserNodes = (parentId = null, page = 1) => async () => {
  const params = { parentId: parentId === null ? 'null' : parentId, page, perPage: NODES_PER_PAGE }
  const res = await getWithToken(Endpoints.api.featureNodes, params)
  return {
    data: res.data.data || [],
    pagination: res.data.pagination || { page: 1, isLastPage: true },
  }
}

export const fetchSummaryNotesByNode = (nodeId, page = 1) => async (dispatch) => {
  try {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: true, isLoadingMore: page > 1 }))
    const response = await getWithToken(Endpoints.api.summaryNotesV2, { nodeId, perPage: NOTES_PER_PAGE, page })
    const { data, pagination } = response.data
    if (page === 1) {
      dispatch(actions.setNodeNotes({ nodeId, notes: data || [], page, isLastPage: pagination.isLastPage }))
    } else {
      dispatch(actions.appendNodeNotes({ nodeId, notes: data || [], page, isLastPage: pagination.isLastPage }))
    }
    return { notes: data || [], isLastPage: pagination.isLastPage }
  } finally {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: false, isLoadingMore: page > 1 }))
  }
}

export const fetchSummaryNoteDetailV2 = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isNoteDetailLoading: true }))
    dispatch(actions.setDetail(null))
    const response = await getWithToken(`${Endpoints.api.summaryNotesV2}/${uniqueId}`)
    const note = response.data.data
    dispatch(actions.setDetail(note))
    dispatch(actions.prependRecentlyViewed({
      id: `temp-${note.id}`,
      recordType: 'summary_note',
      recordId: note.id,
      metadata: { title: note.title, uniqueId: note.uniqueId },
    }))
    return note
  } finally {
    dispatch(actions.setLoading({ isNoteDetailLoading: false }))
  }
}

export const searchSummaryNotesV2 = (search) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isSearchLoading: true }))
    const response = await getWithToken(Endpoints.api.summaryNotesV2, { search, perPage: 50 })
    dispatch(actions.setSearchResults(response.data.data || []))
  } finally {
    dispatch(actions.setLoading({ isSearchLoading: false }))
  }
}

export const fetchRecentlyViewed = () => async (dispatch) => {
  try {
    const response = await getWithToken(Endpoints.api.recentlyViewed, {
      recordType: 'summary_note',
      limit: 5
    })
    dispatch(actions.setRecentlyViewed(response.data.data || []))
  } catch {}
}
