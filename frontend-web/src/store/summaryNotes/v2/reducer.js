import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nodes: [],          // flat list of feature_nodes (from /api/v1/feature-nodes)
  nodeNotes: {},      // { [nodeId]: { notes: [], isLoaded: false, isLoading: false } }
  detail: null,       // currently viewed note detail (shared admin + user)
  searchResults: [],
  loading: {
    isNodesLoading: false,
    isNoteDetailLoading: false,
    isSearchLoading: false,
    isLinkedFlashcardsLoading: false,
    isLinkedMcqLoading: false,
    isAdminNotesLoading: false,
    isUpdating: false,
    isCreating: false,
    isDeleting: false,
    isGenerating: false,
  },
  recentlyViewed: [], // [{ id, recordType, recordId, metadata: { title, uniqueId }, viewedAt }]
  linkedFlashcards: [],
  linkedFlashcardsPagination: { page: 1, perPage: 6, isLastPage: true },
  linkedMcq: [],
  linkedMcqPagination: { page: 1, perPage: 6, isLastPage: true },
  // Admin list state
  notes: [],
  pagination: { page: 1, perPage: 50, isLastPage: false },
}

const summaryNotesV2Slice = createSlice({
  name: 'summaryNotesV2',
  initialState,
  reducers: {
    setNodes(state, { payload }) {
      state.nodes = payload
    },
    setNodeNotes(state, { payload: { nodeId, notes, page = 1, isLastPage = true } }) {
      state.nodeNotes[nodeId] = { notes, isLoaded: true, isLoading: false, isLoadingMore: false, page, isLastPage }
    },
    appendNodeNotes(state, { payload: { nodeId, notes, page, isLastPage } }) {
      if (!state.nodeNotes[nodeId]) return
      state.nodeNotes[nodeId].notes = [...state.nodeNotes[nodeId].notes, ...notes]
      state.nodeNotes[nodeId].page = page
      state.nodeNotes[nodeId].isLastPage = isLastPage
      state.nodeNotes[nodeId].isLoadingMore = false
    },
    setNodeNotesLoading(state, { payload: { nodeId, value, isLoadingMore = false } }) {
      if (!state.nodeNotes[nodeId]) {
        state.nodeNotes[nodeId] = { notes: [], isLoaded: false, isLoading: false, isLoadingMore: false, page: 1, isLastPage: true }
      }
      if (isLoadingMore) {
        state.nodeNotes[nodeId].isLoadingMore = value
      } else {
        state.nodeNotes[nodeId].isLoading = value
      }
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
    prependRecentlyViewed(state, { payload }) {
      const filtered = state.recentlyViewed.filter(r => r.metadata?.uniqueId !== payload.metadata?.uniqueId)
      state.recentlyViewed = [payload, ...filtered].slice(0, 5)
    },
    setLinkedFlashcards(state, { payload: { data, pagination } }) {
      state.linkedFlashcards = data
      state.linkedFlashcardsPagination = pagination
    },
    appendLinkedFlashcards(state, { payload: { data, pagination } }) {
      state.linkedFlashcards = [...state.linkedFlashcards, ...data]
      state.linkedFlashcardsPagination = pagination
    },
    setLinkedMcq(state, { payload: { data, pagination } }) {
      state.linkedMcq = data
      state.linkedMcqPagination = pagination
    },
    appendLinkedMcq(state, { payload: { data, pagination } }) {
      state.linkedMcq = [...state.linkedMcq, ...data]
      state.linkedMcqPagination = pagination
    },
    setNotes(state, { payload }) {
      state.notes = payload
    },
    appendNotes(state, { payload }) {
      state.notes = [...state.notes, ...payload]
    },
    setPagination(state, { payload }) {
      state.pagination = payload
    },
  }
})

export const { actions } = summaryNotesV2Slice
export default summaryNotesV2Slice.reducer
