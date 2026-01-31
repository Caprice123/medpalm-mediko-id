import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  users: [],
  detail: null,
  subscriptions: [],
  subscriptionFilter: 'all', // 'all' or 'active'
  filter: {
    email: undefined,
    name: undefined,
    status: undefined,
  },
  pagination: {
    page: 1,
    perPage: 50,
    isLastPage: false
  },
  subscriptionPagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  loading: {
    isGetUsersLoading: false,
    isAdjustCreditLoading: false,
    isAdjustSubscriptionLoading: false,
    isAddSubscriptionLoading: false,
    isFetchUserDetailLoading: false,
    isFetchUserSubscriptionsLoading: false,
  },
}

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setPage: (state, { payload }) => {
        state.pagination.page = payload
    },
    setPagination: (state, action) => {
      const { page, perPage, isLastPage } = action.payload
      state.pagination.page = page
      state.pagination.perPage = perPage
      state.pagination.isLastPage = isLastPage
    },
    setUsers: (state, action) => {
      state.users = action.payload
    },
    setDetail: (state, action) => {
        state.detail = action.payload
    },
    updateFilter: (state, { payload }) => {
        state.pagination.currentPage = 1
        Object.assign(state.filter, { [payload.key]: payload.value })
    },
    setSubscriptions: (state, action) => {
      state.subscriptions = action.payload
    },
    setSubscriptionPagination: (state, action) => {
      const { page, perPage, isLastPage } = action.payload
      state.subscriptionPagination.page = page
      state.subscriptionPagination.perPage = perPage
      state.subscriptionPagination.isLastPage = isLastPage
    },
    setSubscriptionPage: (state, { payload }) => {
        state.subscriptionPagination.page = payload
    },
    setSubscriptionFilter: (state, { payload }) => {
        state.subscriptionFilter = payload
        state.subscriptionPagination.page = 1 // Reset to page 1 when filter changes
    },
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export const actions = usersSlice.actions
export default usersSlice.reducer
