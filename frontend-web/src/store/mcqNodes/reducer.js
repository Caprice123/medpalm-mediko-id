import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  topics: [],
  sessionQuestions: [],
  loading: {
    isFetchingTopics: false,
    isStartingSession: false,
    isSubmittingSession: false,
  },
}

const mcqNodesSlice = createSlice({
  name: 'mcqNodes',
  initialState,
  reducers: {
    setTopics(state, action) { state.topics = action.payload },
    setSessionQuestions(state, action) { state.sessionQuestions = action.payload },
    setLoading(state, action) { state.loading = { ...state.loading, ...action.payload } },
    reset() { return initialState },
  },
})

export const { actions } = mcqNodesSlice
export default mcqNodesSlice.reducer
