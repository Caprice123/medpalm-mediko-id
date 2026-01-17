import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  // Admin state
  topics: [],
  observations: [],
  topicDetail: null,

  // User-facing state
  userTopics: [], // Available topics for user to select
  userSessions: [], // User's session history

  // Session result details
  sessionDetail: null,
  sessionMessages: [],
  sessionObservations: [],
  sessionDiagnoses: [],
  sessionTherapies: [],

  loading: {
    isGetListTopicsLoading: false,
    isCreatingTopic: false,
    isUpdatingTopic: false,
    isDeletingTopic: false,
    isGetTopicDetailLoading: false,
    isLoadingUserTopics: false,
    isLoadingUserSessions: false,
    isLoadingSessionDetail: false,
    isLoadingSessionMessages: false,
    isLoadingSessionObservations: false,
    isLoadingSessionDiagnoses: false,
    isLoadingSessionTherapies: false,
  },
  filters: {
    topic: '',
    batch: '',
    status: ''
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
}

const { reducer, actions } = createSlice({
  name: 'oscePractice',
  initialState,
  reducers: {
    setLoading: (state, { payload: { key, value } }) => {
      state.loading[key] = value
    },
    setTopics: (state, { payload }) => {
      state.topics = payload
    },
    setTopicDetail: (state, { payload }) => {
      state.topicDetail = payload
    },
    setObservations: (state, { payload }) => {
      state.observations = payload
    },
    updateFilter: (state, { payload: { key, value } }) => {
      state.filters[key] = value
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
    },
    updatePagination: (state, { payload }) => {
      state.pagination = { ...state.pagination, ...payload }
    },
    setUserTopics: (state, { payload }) => {
      state.userTopics = payload
    },
    setUserSessions: (state, { payload }) => {
      state.userSessions = payload
    },
    setSessionDetail: (state, { payload }) => {
      state.sessionDetail = payload
    },
    setSessionMessages: (state, { payload }) => {
      state.sessionMessages = payload
    },
    setSessionObservations: (state, { payload }) => {
      state.sessionObservations = payload
    },
    setSessionDiagnoses: (state, { payload }) => {
      state.sessionDiagnoses = payload
    },
    setSessionTherapies: (state, { payload }) => {
      state.sessionTherapies = payload
    }
  },

  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading, // preserve current loading state
    }));
  },
})

export { actions }
export default reducer
