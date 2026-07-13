import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nodes: [],          // flat list of feature_nodes (from /api/v1/feature-nodes)
  nodeNotes: {},      // { [nodeId]: { notes: [], isLoaded: false, isLoading: false } }
  detail: null,       // currently viewed note detail
  searchResults: [],
  loading: {
    isNodesLoading: false,
    isNoteDetailLoading: false,
    isSearchLoading: false,
  },
  recentlyViewed: [], // [{ id, recordType, recordId, metadata: { title, uniqueId }, viewedAt }]
}

const summaryNotesV2Slice = createSlice({
  name: 'summaryNotesV2',
  initialState,
  reducers: {
    setNodes(state, { payload }) {
      state.nodes = payload
    },
    setNodeNotes(state, { payload: { nodeId, notes } }) {
      state.nodeNotes[nodeId] = { notes, isLoaded: true, isLoading: false }
    },
    setNodeNotesLoading(state, { payload: { nodeId, value } }) {
      if (!state.nodeNotes[nodeId]) {
        state.nodeNotes[nodeId] = { notes: [], isLoaded: false, isLoading: false }
      }
      state.nodeNotes[nodeId].isLoading = value
    },
    setDetail(state, { payload }) {
      state.detail = payload
    },
    setSearchResults(state, { payload }) {
      state.searchResults = payload
    },
    setLoading(state, { payload }) {
      state.loading = { ...state.loading, ...payload }
    },
    setRecentlyViewed(state, { payload }) {
      state.recentlyViewed = payload
    },
  }
})

export const { actions } = summaryNotesV2Slice
export default summaryNotesV2Slice.reducer
