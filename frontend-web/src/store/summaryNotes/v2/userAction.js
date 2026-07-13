import { actions } from './reducer'
import Endpoints from '@config/endpoint'
import { getWithToken } from '@utils/requestUtils'

export const fetchSummaryNotesNodes = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isNodesLoading: true }))
    const response = await getWithToken(Endpoints.api.featureNodes)
    dispatch(actions.setNodes(response.data.data || []))
  } finally {
    dispatch(actions.setLoading({ isNodesLoading: false }))
  }
}

export const fetchSummaryNotesByNode = (nodeId) => async (dispatch) => {
  try {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: true }))
    const response = await getWithToken(Endpoints.api.summaryNotesV2, { nodeId, perPage: 100 })
    dispatch(actions.setNodeNotes({ nodeId, notes: response.data.data || [] }))
  } finally {
    dispatch(actions.setNodeNotesLoading({ nodeId, value: false }))
  }
}

export const fetchSummaryNoteDetailV2 = (uniqueId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ isNoteDetailLoading: true }))
    dispatch(actions.setDetail(null))
    const response = await getWithToken(`${Endpoints.api.summaryNotesV2}/${uniqueId}`)
    const note = response.data.data
    dispatch(actions.setDetail(note))
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
