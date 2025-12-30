import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  // User data
  notes: [],
  detail: null,

  // ChromaDB Embeddings
  embeddings: [],
  selectedEmbedding: null,

  // Pagination
  pagination: {
    page: 1,
    perPage: 30,
    isLastPage: false
  },
  embeddingsPagination: {
    page: 1,
    perPage: 20,
    totalCount: 0,
    totalPages: 0,
    isLastPage: false
  },

  // Loading states
  loading: {
    isNotesLoading: false,
    isAdminNotesLoading: false,
    isNoteDetailLoading: false,
    isGenerating: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isStartingSession: false,
    isSessionLoading: false,
    isEmbeddingsLoading: false,
    isEmbeddingDetailLoading: false
  },

  // Filters
  filters: {
    university: '',
    semester: '',
    status: '',
    isActive: '',
    search: ''
  },

  error: null
}

const { reducer, actions } = createSlice({
  name: 'summaryNotes',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },

    // User actions
    setNotes: (state, { payload }) => {
      state.notes = payload
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },

    // Embeddings actions
    setEmbeddings: (state, { payload }) => {
      state.embeddings = payload
    },
    setSelectedEmbedding: (state, { payload }) => {
      state.selectedEmbedding = payload
    },
    clearSelectedEmbedding: (state) => {
      state.selectedEmbedding = null
    },
    setEmbeddingsPagination: (state, { payload }) => {
      state.embeddingsPagination = { ...state.embeddingsPagination, ...payload }
    },

    // Pagination
    setPagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload }
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    nextPage: (state) => {
      if (!state.pagination.isLastPage) {
        state.pagination.page += 1
      }
    },
    previousPage: (state) => {
      if (state.pagination.page > 1) {
        state.pagination.page -= 1
      }
    },

    // Filters
    setFilters: (state, { payload }) => {
      state.filters = { ...state.filters, ...payload }
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filters[key] = value
    },
    clearFilters: (state) => {
      state.filters = {
        university: '',
        semester: '',
        status: '',
        isActive: '',
        search: ''
      }
    },

    // Error
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export { actions }
export default reducer
