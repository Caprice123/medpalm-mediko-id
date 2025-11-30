import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  topics: [],
  selectedTopic: null,
  loading: {
    isTopicsLoading: false,
    isCreatingTopic: false,
    isUpdatingTopic: false,
    isDeletingTopic: false
  },
  error: null
}

const { reducer, actions } = createSlice({
  name: 'calculator',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
    },
    setSelectedTopic: (state, { payload }) => {
      state.selectedTopic = payload
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addTopic: (state, { payload }) => {
      state.topics.push(payload)
    },
    updateTopic: (state, { payload }) => {
      const index = state.topics.findIndex(t => t.id === payload.id)
      if (index !== -1) {
        state.topics[index] = payload
      }
    },
    removeTopic: (state, { payload }) => {
      state.topics = state.topics.filter(t => t.id !== payload)
    }
  }
})

export { actions }
export default reducer
