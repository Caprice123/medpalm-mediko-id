import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nodes: [],          // flat list of feature_nodes (from /api/v1/feature-nodes)
  nodeNotes: {},      // { [nodeId]: { notes: [], isLoaded: false, isLoading: false } }
  // Lazy-loaded subtopic children of a topic node. Kept in the store rather than in
  // the sidebar's own state because the reader needs them too, to work out the
  // previous/next note within the same topic.
  nodeChildren: {},           // { [parentId]: [node, …] }
  nodeChildrenPagination: {}, // { [parentId]: { page, isLastPage } }
  loadingNodeIds: [],         // parent ids whose children are being fetched
  detail: null,       // currently viewed note detail (shared admin + user)
  searchResults: [],
  userTopics: { primary: [], special: [] },
  nodeStats: null,
  anatomyQuizzes: [],
  loading: {
    isNodesLoading: false,
    isNoteDetailLoading: false,
    isSearchLoading: false,
    isAdminNotesLoading: false,
    isUpdating: false,
    isCreating: false,
    isDeleting: false,
    isGenerating: false,
    isFetchingUserTopics: false,
  },
  recentlyViewed: [], // [{ id, recordType, recordId, metadata: { title, uniqueId }, viewedAt }]
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
    setNodeChildren(state, { payload: { nodeId, children } }) {
      state.nodeChildren[nodeId] = children
    },
    appendNodeChildren(state, { payload: { nodeId, children } }) {
      state.nodeChildren[nodeId] = [...(state.nodeChildren[nodeId] || []), ...children]
    },
    setNodeChildrenPagination(state, { payload: { nodeId, pagination } }) {
      state.nodeChildrenPagination[nodeId] = pagination
    },
    setNodeChildrenLoading(state, { payload: { nodeId, value } }) {
      state.loadingNodeIds = value
        ? [...new Set([...state.loadingNodeIds, nodeId])]
        : state.loadingNodeIds.filter(id => id !== nodeId)
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
    setUserTopics(state, { payload }) {
      state.userTopics = payload
    },
    setNodeStats(state, { payload }) {
      state.nodeStats = payload
    },
    setAnatomyQuizzes(state, { payload }) {
      state.anatomyQuizzes = payload
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
