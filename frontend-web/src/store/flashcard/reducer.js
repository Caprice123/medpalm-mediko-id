import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  decks: [],
  tags: [],
  detail: null,
  loading: {
    isGetListDecksLoading: false,
    isTagsLoading: false,
    isGeneratingCards: false,
    isCreatingDeck: false,
    isUpdatingDeck: false,
    isDeletingDeck: false,
    isGetDetailFlashcardDeckLoading: false,
    isUploadingImage: false,
    isLinkedMcqLoading: false,
    isLinkedSummaryNotesLoading: false,
  },
  linkedMcq: [],
  linkedMcqPagination: { page: 1, perPage: 6, isLastPage: true },
  linkedSummaryNotes: [],
  linkedSummaryNotesPagination: { page: 1, perPage: 6, isLastPage: true },
  filters: {
    search: '',
    topic: '',
    department: '',
    university: '',
    semester: '',
    status: ''
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
}

const { reducer, actions } = createSlice({
  name: 'flashcard',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDecks: (state, { payload }) => {
      state.decks = payload
    },
    appendDecks: (state, { payload }) => {
      state.decks = [...state.decks, ...payload]
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filters[key] = value
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
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    updatePagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload }
    },
    setLinkedMcq: (state, { payload: { data, pagination } }) => {
      state.linkedMcq = data
      state.linkedMcqPagination = pagination
    },
    appendLinkedMcq: (state, { payload: { data, pagination } }) => {
      state.linkedMcq = [...state.linkedMcq, ...data]
      state.linkedMcqPagination = pagination
    },
    setLinkedSummaryNotes: (state, { payload: { data, pagination } }) => {
      state.linkedSummaryNotes = data
      state.linkedSummaryNotesPagination = pagination
    },
    appendLinkedSummaryNotes: (state, { payload: { data, pagination } }) => {
      state.linkedSummaryNotes = [...state.linkedSummaryNotes, ...data]
      state.linkedSummaryNotesPagination = pagination
    },
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
