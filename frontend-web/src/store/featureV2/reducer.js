import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  features: [],
  loading: {
    isLoadingFeatures: false,
  },
  error: null,
}

const featureV2Slice = createSlice({
  name: 'featureV2',
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
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => {
        return ({
            ...state,
            features: state.features
        })
    })
  },
})

export const { actions } = featureV2Slice
export default featureV2Slice.reducer
