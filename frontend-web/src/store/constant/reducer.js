import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  constants: [],
  filter: {
    name: undefined,
    tagName: undefined
  },
  loading: {
    isGetListConstantsLoading: false,
    isUpdateConstantLoading: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'constants',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setConstants: (state, { payload }) => {
      state.constants = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    }
  }
})

export { actions }
export default reducer
