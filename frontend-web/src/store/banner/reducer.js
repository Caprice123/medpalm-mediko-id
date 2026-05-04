import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  banners: [],
  activeBanners: [],
  detail: undefined,
  filter: { search: undefined, isActive: undefined },
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: {
    isGetListLoading: false,
    isGetDetailLoading: false,
    isCreateLoading: false,
    isUpdateLoading: false,
    isDeleteLoading: false,
    isGetActiveBannersLoading: false,
  },
}

const { reducer, actions } = createSlice({
  name: 'banner',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setBanners: (state, { payload }) => {
      state.banners = payload
    },
    setActiveBanners: (state, { payload }) => {
      state.activeBanners = payload
    },
    setDetail: (state, { payload }) => {
      state.detail = payload
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
