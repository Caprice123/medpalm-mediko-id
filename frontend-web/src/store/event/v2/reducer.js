import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// Event V2 keeps its own slice: the V1 slice is still read by the Dashboard and
// the archived V1 page, and V2 needs a different shape — two independently
// fetched tracks (claimable now, and my claim history) rather than one list
// behind a tab.
const initialState = {
  // Track one: events whose claim window is open right now.
  claimable: [],
  // Track two: my claims, newest first. Not paginated in the UI — a student has
  // a handful of these, and the history is the page's main content.
  claims: [],
  filter: {
    search: '',
  },
  pagination: {
    page: 1,
    perPage: 12,
    isLastPage: false,
  },
  loading: {
    isFetchingClaimable: false,
    isFetchingClaims: false,
    isClaiming: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'eventV2',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setClaimable: (state, { payload }) => {
      state.claimable = payload
    },
    appendClaimable: (state, { payload }) => {
      state.claimable = [...state.claimable, ...payload]
    },
    setClaims: (state, { payload }) => {
      state.claims = payload
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
