import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  models: [],
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: { isFetchingModels: false, isUnlinkingModel: false, isUpdatingModel: false, isMovingModel: false },
}

const nodeAtlasSlice = createSlice({
  name: 'nodeAtlas',
  initialState,
  reducers: {
    setModels(state, action) { state.models = action.payload },
    appendModels(state, action) { state.models = [...state.models, ...action.payload] },
    setPagination(state, action) { state.pagination = { ...state.pagination, ...action.payload } },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = nodeAtlasSlice
export default nodeAtlasSlice.reducer
