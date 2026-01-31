import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  features: [],
  loading: {
    isLoadingFeatures: false
  },
  error: null
}

const featureSlice = createSlice({
  name: 'feature',
  initialState,
  reducers: {
    setFeatures: (state, action) => {
      state.features = action.payload
    },
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export const { actions } = featureSlice
export default featureSlice.reducer
