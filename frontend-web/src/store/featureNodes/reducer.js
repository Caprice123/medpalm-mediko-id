import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  nodes: [],
  nodeRecords: [],
  userTopics: { primary: [], special: [] },
  filter: {
    search: '',
    nodeType: '',
    visibility: '',
    classification: '',
    layer: '',
    parentId: '',
  },
  loading: {
    isFetchingNodes: false,
    isCreating: false,
    isUpdating: false,
    isDeleting: false,
    isFetchingRecords: false,
    isCreatingRecord: false,
    isDeletingRecord: false,
    isAutoLinking: false,
    isFetchingUserTopics: false,
    isUploadingVideo: false,
    isFetchingDetail: false,
  },
}

const featureNodesSlice = createSlice({
  name: 'featureNodes',
  initialState,
  reducers: {
    setNodes(state, action) { state.nodes = action.payload },
    setNodeRecords(state, action) { state.nodeRecords = action.payload },
    setUserTopics(state, action) { state.userTopics = action.payload },
    updateFilter(state, { payload: { key, value } }) { state.filter[key] = value },
    resetFilter(state) { state.filter = initialState.filter },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = featureNodesSlice
export default featureNodesSlice.reducer
