import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  models: [],
  filter: {
    search: undefined,
    topic: undefined,
    subtopic: undefined,
    status: undefined
  },
  detail: undefined,
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  loading: {
    isGetListAtlasLoading: false,
    isGetDetailAtlasLoading: false,
    isCreateAtlasLoading: false,
    isUpdateAtlasLoading: false,
    isDeleteAtlasLoading: false,
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'atlas',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
    },
    setModels: (state, { payload }) => {
      state.models = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    }
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading,
    }))
  }
})

export { actions }
export default reducer
