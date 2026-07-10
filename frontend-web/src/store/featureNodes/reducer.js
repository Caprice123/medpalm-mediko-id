import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nodes: [],
  nodeRecords: [],
  loading: {
    isFetchingNodes: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isFetchingRecords: false,
    isCreatingRecord: false,
    isDeletingRecord: false,
    isAutoLinking: false,
  },
}

const featureNodesSlice = createSlice({
  name: 'featureNodes',
  initialState,
  reducers: {
    setNodes(state, action) { state.nodes = action.payload },
    setNodeRecords(state, action) { state.nodeRecords = action.payload },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = featureNodesSlice
export default featureNodesSlice.reducer
