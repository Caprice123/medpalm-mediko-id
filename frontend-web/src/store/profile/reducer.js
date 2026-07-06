import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  profile: null,
  loading: {
    isFetchLoading: false,
    isUpdateLoading: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setProfile: (state, { payload }) => {
      state.profile = payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, () => ({ ...initialState }))
  },
})

export { actions }
export default reducer
