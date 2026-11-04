import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// Webinar V2 keeps its own slice rather than extending `state.webinar`: the V1
// slice is still read by the Dashboard banner and by the archived V1 page, and
// V2 needs a different shape (a pinned `featured` webinar, an appending list).
const initialState = {
  // The nearest webinar whose registration window is currently open. Fetched on
  // its own so the billboard never changes when the list filter changes.
  featured: null,
  webinars: [],
  myRegistrations: [],
  filter: {
    search: '',
    registrationStatus: 'open',
  },
  pagination: {
    page: 1,
    perPage: 12,
    isLastPage: false,
  },
  loading: {
    isFetchingFeatured: false,
    isFetchingWebinars: false,
    isFetchingMyRegistrations: false,
    isRegistering: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'webinarV2',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setFeatured: (state, { payload }) => {
      state.featured = payload
    },
    setWebinars: (state, { payload }) => {
      state.webinars = payload
    },
    appendWebinars: (state, { payload }) => {
      state.webinars = [...state.webinars, ...payload]
    },
    setMyRegistrations: (state, { payload }) => {
      state.myRegistrations = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload }
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading,
    }))
  },
})

export { actions }
export default reducer
