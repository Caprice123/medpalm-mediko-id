import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  // Counts shown in the landing hero ticker and trust card.
  stats: {
    ticker: null,
    trust: null,
  },
  // Upcoming events and running challenges shown on the landing page. `null`
  // means "not fetched yet" and an empty array means "there genuinely are
  // none", which is what lets those sections tell a loading state apart from
  // an empty one.
  events: null,
  challenges: null,
  loading: {
    isFetchingStats: false,
    isFetchingEvents: false,
    isFetchingChallenges: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setStats: (state, { payload }) => {
      state.stats = { ticker: payload.ticker, trust: payload.trust }
    },
    setEvents: (state, { payload }) => {
      state.events = payload
    },
    setChallenges: (state, { payload }) => {
      state.challenges = payload
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
