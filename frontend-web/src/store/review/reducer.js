import { createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    sessionCards: [],
    sessionUniqueId: null,
    customSessions: [],
    stats: null,
    loading: {
      isFetchingSession: false,
      isSubmittingRating: false,
      isFetchingCustomSessions: false,
      isCreatingCustomSession: false,
      isDeletingCustomSession: false,
      isFetchingStats: false,
    },
  },
  reducers: {
    setSessionCards: (state, { payload }) => { state.sessionCards = payload },
    setSessionUniqueId: (state, { payload }) => { state.sessionUniqueId = payload },
    setCustomSessions: (state, { payload }) => { state.customSessions = payload },
    setStats: (state, { payload }) => { state.stats = payload },
    setLoading: (state, { payload }) => { state.loading[payload.key] = payload.value },
  },
})

export const { actions } = reviewSlice
export default reviewSlice.reducer
