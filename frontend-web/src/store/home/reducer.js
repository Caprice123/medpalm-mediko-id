import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  // Counts shown in the landing hero ticker and trust card.
  stats: {
    ticker: null,
    trust: null,
  },
  loading: {
    isFetchingStats: false,
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
