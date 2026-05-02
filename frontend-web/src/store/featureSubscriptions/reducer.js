import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  items: [],
  filter: {
    feature: undefined,
    isActive: undefined,
    search: undefined,
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false,
  },
  loading: {
    isFetchLoading: false,
    isCreateLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
  },
}

const featureSubscriptionsSlice = createSlice({
  name: 'featureSubscriptions',
  initialState,
  reducers: {
    setLoading: (state, { payload }) => {
      state.loading[payload.key] = payload.value
    },
    setItems: (state, { payload }) => {
      state.items = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination.page = payload.page
      state.pagination.perPage = payload.perPage
      state.pagination.isLastPage = payload.isLastPage
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    updateFilter: (state, { payload }) => {
      state.pagination.page = 1
      state.filter[payload.key] = payload.value
    },
    updateItem: (state, { payload }) => {
      const idx = state.items.findIndex(i => i.id === payload.id)
      if (idx !== -1) state.items[idx] = payload
    },
    removeItem: (state, { payload }) => {
      state.items = state.items.filter(i => i.id !== payload)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => initialState)
  },
})

export const actions = featureSubscriptionsSlice.actions
export default featureSubscriptionsSlice.reducer
