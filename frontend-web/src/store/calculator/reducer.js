import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  topics: [],
  filters: {
    name: '',
    tagName: ''
  },
  detail: null,
  loading: {
    isGetListCalculatorsLoading: false,
    isGetDetailCalculatorLoading: false,
    isCreateCalculatorLoading: false,
    isUpdateCalculatorLoading: false,
    isDeleteCalculatorLoading: false,
    isCalculateResultLoading: false,
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
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
