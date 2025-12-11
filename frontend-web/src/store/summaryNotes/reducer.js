import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // User data
  notes: [],
  noteSession: null,

  // Admin data
  adminNotes: [],
  selectedNote: null,
  generatedContent: null,

  // Pagination
  pagination: {
    page: 1,
    perPage: 30,
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
    isSessionLoading: false
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
    setNoteSession: (state, { payload }) => {
      state.noteSession = payload
    },
    clearNoteSession: (state) => {
      state.noteSession = null
    },

    // Admin actions
    setAdminNotes: (state, { payload }) => {
      state.adminNotes = payload
    },
    setSelectedNote: (state, { payload }) => {
      state.selectedNote = payload
    },
    clearSelectedNote: (state) => {
      state.selectedNote = null
    },
    setGeneratedContent: (state, { payload }) => {
      state.generatedContent = payload
    },
    clearGeneratedContent: (state) => {
      state.generatedContent = null
    },
    addNote: (state, { payload }) => {
      state.adminNotes = [payload, ...state.adminNotes]
    },
    updateNote: (state, { payload }) => {
      const index = state.adminNotes.findIndex(n => n.id === payload.id)
      if (index !== -1) {
        state.adminNotes[index] = payload
      }
    },
    removeNote: (state, { payload }) => {
      state.adminNotes = state.adminNotes.filter(n => n.id !== payload)
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
  }
})

export { actions }
export default reducer
