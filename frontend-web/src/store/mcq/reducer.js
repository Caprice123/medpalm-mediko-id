import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  topics: [],
  selectedTopic: null,
  currentTopic: null, // For user viewing/taking a topic
  questions: [],
  currentSession: null, // For user taking quiz
  uploadedQuestionImage: null, // For admin creating quiz with image
  pagination: {
    page: 1,
    limit: 30,
    isLastPage: false
  },
  loading: {
    isTopicsLoading: false,
    isTopicLoading: false,
    isCreatingTopic: false,
    isUpdatingTopic: false,
    isDeletingTopic: false,
    isUploadingImage: false,
    isGenerating: false,
    isChecking: false,
    isSubmitAnatomyQuizLoading: false,
    isConstantsLoading: false,
    isUpdatingConstants: false,
  },
  error: null,
  filter: {
    university: '',
    semester: '',
    status: '',
    search: ''
  }
}

const { reducer, actions } = createSlice({
  name: 'mcq',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
    },
    setPagination: (state, { payload }) => {
      state.pagination = payload
    },
    setSelectedTopic: (state, { payload }) => {
      state.selectedTopic = payload
    },
    setCurrentTopic: (state, { payload }) => {
      state.currentTopic = payload
    },
    setQuestions: (state, { payload }) => {
      state.questions = payload
    },
    setCurrentSession: (state, { payload }) => {
      state.currentSession = payload
    },
    setUploadedQuestionImage: (state, { payload }) => {
      state.uploadedQuestionImage = payload
    },
    setFilters: (state, { payload }) => {
      state.filter = { ...state.filter, ...payload }
    },
    clearFilters: (state) => {
      state.filter = {
        university: '',
        semester: '',
        status: '',
        search: ''
      }
    },
    setError: (state, { payload }) => {
      state.error = payload
    },
    clearError: (state) => {
      state.error = null
    },
    addTopic: (state, { payload }) => {
      state.topics = [payload, ...state.topics]
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filter[key] = value
    },
    updateTopic: (state, { payload }) => {
      const index = state.topics.findIndex(t => t.id === payload.id)
      if (index !== -1) {
        state.topics[index] = payload
      }
    },
    removeTopic: (state, { payload }) => {
      state.topics = state.topics.filter(t => t.id !== payload)
    },
    addQuestion: (state, { payload }) => {
      state.questions = [...state.questions, payload]
    },
    updateQuestion: (state, { payload }) => {
      const index = state.questions.findIndex(q => q.id === payload.id)
      if (index !== -1) {
        state.questions[index] = payload
      }
    },
    removeQuestion: (state, { payload }) => {
      state.questions = state.questions.filter(q => q.id !== payload)
    },
    clearUploadedQuestionImage: (state) => {
      state.uploadedQuestionImage = null
    },
    clearSelectedTopic: (state) => {
      state.selectedTopic = null
      state.questions = []
    },
    clearCurrentTopic: (state) => {
      state.currentTopic = null
    },
    clearCurrentSession: (state) => {
      state.currentSession = null
    },
    nextPage: (state) => {
      if (!state.pagination.isLastPage) {
        state.pagination.page += 1
      }
    },
    previousPage: (state) => {
      if (state.pagination.page > 1) {
        state.pagination.page -= 1
      }
    },
    setPage: (state, { payload }) => {
      state.pagination.page = payload
    }
  },
  
    extraReducers: (builder) => {
      builder.addCase(resetAllState, (state) => ({
          ...initialState,
          loading: state.loading, // 🔥 preserve current loading state
      }));
    },
})

export { actions }
export default reducer
