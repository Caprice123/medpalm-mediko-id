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
  },
  filters: {
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
