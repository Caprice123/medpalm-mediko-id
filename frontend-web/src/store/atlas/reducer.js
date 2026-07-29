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
  modelRelations: [],
  searchedAtlasModels: [],
  loading: {
    isGetListAtlasLoading: false,
    isGetDetailAtlasLoading: false,
    isCreateAtlasLoading: false,
    isUpdateAtlasLoading: false,
    isDeleteAtlasLoading: false,
    isFetchingModelRelations: false,
    isAddingModelRelation: false,
    isDeletingModelRelation: false,
    isSearchingAtlasModels: false,
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
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    setModelRelations: (state, { payload }) => {
      state.modelRelations = payload
    },
    setSearchedAtlasModels: (state, { payload }) => {
      state.searchedAtlasModels = payload
    },
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
