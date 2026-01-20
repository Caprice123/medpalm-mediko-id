import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  // Admin state
  topics: [],
  observations: [],
  topicDetail: null,
  rubrics: [],
  rubricDetail: null,
  allRubrics: [], // For dropdowns

  // User-facing state
  userTopics: [], // Available topics for user to select
  userSessions: [], // User's session history
  streamingMessage: null,

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
    isGetListRubricsLoading: false,
    isCreatingRubric: false,
    isUpdatingRubric: false,
    isDeletingRubric: false,
    isGetRubricDetailLoading: false,
    isFetchingAllRubrics: false,
    isLoadingUserTopics: false,
    isLoadingUserSessions: false,
    isLoadingSessionDetail: false,
    isLoadingSessionMessages: false,
    isLoadingMoreMessages: false,
    isLoadingSessionObservations: false,
    isLoadingSessionDiagnoses: false,
    isLoadingSessionTherapies: false,
    isSendingMessage: false,
  },
  messagesPagination: {
    hasMore: false,
    nextCursor: null,
  },
  filters: {
    topic: '',
    batch: '',
    status: ''
  },
  rubricFilters: {
    name: '',
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  rubricPagination: {
    page: 1,
    perPage: 10,
    totalPages: 1,
    totalCount: 0,
    hasMore: false,
    isLastPage: true,
  },
  messagePagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  }
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
    setMessagePagination: (state, { payload }) => {
        state.messagePagination = payload
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
    addMessage: (state, { payload: { sessionId, message } }) => {
      // Add message to the end of the messages array
      state.sessionMessages.push(message)
    },
    updateMessage: (state, { payload: { sessionId, messageId, content } }) => {
      // Find and update message content
      const messageIndex = state.sessionMessages.findIndex(m => m.id === messageId)
      if (messageIndex !== -1) {
        state.sessionMessages[messageIndex].content = content
      }
    },
    removeMessage: (state, { payload: { sessionId, messageId } }) => {
      // Remove message by id
      state.sessionMessages = state.sessionMessages.filter(m => m.id !== messageId)
    },
    prependMessages: (state, { payload: { sessionId, messages } }) => {
      // Add messages to the beginning of the array (for loading older messages)
      state.sessionMessages = [...messages, ...state.sessionMessages]
    },
    setSessionObservations: (state, { payload }) => {
      state.sessionObservations = payload
    },
    setSessionDiagnoses: (state, { payload }) => {
      state.sessionDiagnoses = payload
    },
    setSessionTherapies: (state, { payload }) => {
      state.sessionTherapies = payload
    },
    setRubrics: (state, { payload }) => {
      state.rubrics = payload
    },
    setRubricDetail: (state, { payload }) => {
      state.rubricDetail = payload
    },
    setAllRubrics: (state, { payload }) => {
      state.allRubrics = payload
    },
    updateRubricPagination: (state, { payload }) => {
      state.rubricPagination = {
        ...state.rubricPagination,
        ...payload,
      }
    },
    setRubricFilters: (state, { payload }) => {
      state.rubricFilters = {
        ...state.rubricFilters,
        ...payload,
      }
    },
    setRubricPage: (state, { payload }) => {
      state.rubricPagination.page = payload
    },
    setMessagesPagination: (state, { payload }) => {
      state.messagesPagination = payload
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
