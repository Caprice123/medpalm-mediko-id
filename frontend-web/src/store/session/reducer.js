import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  // Current active session
  currentSession: null,
  topicSnapshot: null,
  currentQuestionIndex: 0,
  answers: [],

  // Session history
  sessions: [],
  sessionDetail: null,
  sessionAttempts: [],
  currentSessionAttempt: null,
  attemptDetail: null,

  // Loading states
  loading: {
    isCreatingSession: false,
    isSubmittingAnswer: false,
    isCompletingSession: false,
    isLoadingSessions: false,
    isLoadingDetail: false,
    isLoadingAttempts: false,
    isLoadingAttemptDetail: false
  },

  // Pagination for history
  pagination: {
    limit: 30,
    offset: 0,
    isLastPage: false
  },

  error: null
}

const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    // Current session management
    setCurrentSession: (state, action) => {
      state.currentSession = action.payload
    },
    setTopicSnapshot: (state, action) => {
      state.topicSnapshot = action.payload
    },
    setCurrentQuestionIndex: (state, action) => {
      state.currentQuestionIndex = action.payload
    },
    setCurrentSessionAttempt: (state, action) => {
        state.currentSessionAttempt = action.payload
    },
    addAnswer: (state, action) => {
      state.answers.push(action.payload)
    },
    clearCurrentSession: (state) => {
      state.currentSession = null
      state.topicSnapshot = null
      state.currentQuestionIndex = 0
      state.answers = []
    },

    // Session history
    setSessions: (state, action) => {
      state.sessions = action.payload
    },
    setSessionDetail: (state, action) => {
      state.sessionDetail = action.payload
    },
    setSessionAttempts: (state, action) => {
        state.sessionAttempts = action.payload
    },
    setAttemptDetail: (state, action) => {
        state.attemptDetail = action.payload
    },

    // Pagination
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },

    // Loading states
    setLoading: (state, action) => {
      state.loading[action.payload.key] = action.payload.value
    },

    // Error handling
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  }
})

export const { actions } = sessionSlice
export default sessionSlice.reducer
