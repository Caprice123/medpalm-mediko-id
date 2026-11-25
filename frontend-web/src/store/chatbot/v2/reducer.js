import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// How many conversations' message lists stay in memory at once. A student
// flicking between threads should not refetch, but every thread ever opened must
// not accumulate either.
const MAX_CACHED_CONVERSATIONS = 10

const emptyStreamingState = {
  isSending: false,
  isTyping: false,
  userStopped: false,
  userMessage: null,
  userMessageCreatedAt: null,
  streamingMessageId: null,
  optimisticUserId: null,
  realMessageId: null,
  realUserMessageId: null,
  displayedContent: '',
  displayedLength: 0,
  mode: null,
}

const initialState = {
  conversations: [],
  currentConversation: null,
  activeConversationId: null,
  // Keyed by conversation uniqueId so a stream keeps running — and keeps
  // rendering into the right thread — while the user reads another one.
  messagesByConversation: {},
  messagePaginationByConversation: {},
  streamingStateByConversation: {},
  currentMode: 'normal',
  availableModes: { normal: true, validated: true, research: true },
  costs: { normal: 5, validated: 8, research: 15 },
  userInformation: { normal: '', validated: '', research: '' },
  // Which vocabulary research mode trusts: 'openalex' filters by journal name,
  // 'perplexity' by domain. Decides which list the settings modal lets a user pick.
  // Matches the backend default so the modal does not flash the journal picker
  // before the bootstrap response lands.
  researchProvider: 'perplexity',
  userSettings: {
    selectedDomains: [],
    customDomains: [],
    domainFilterEnabled: true,
    isTutor: false,
    selectedJournals: [],
    customJournals: [],
    latestYears: null,
    yearFrom: null,
    yearTo: null,
  },
  filters: { search: '' },
  pagination: { page: 1, perPage: 20, isLastPage: false },
  loading: {
    isBootstrapping: false,
    isConversationsLoading: false,
    isLoadingMoreConversations: false,
    isCurrentConversationLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    isCreatingConversation: false,
    isRenamingConversation: false,
    isDeletingConversation: false,
    isUpdatingSettings: false,
  },
}

const chatbotV2Slice = createSlice({
  name: 'chatbotV2',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },

    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    appendConversations: (state, action) => {
      state.conversations = [...state.conversations, ...action.payload]
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload)
    },
    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(c => c.uniqueId === action.payload.uniqueId)
      if (index !== -1) {
        state.conversations[index] = { ...state.conversations[index], ...action.payload }
      }
    },
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c.uniqueId !== action.payload)
      delete state.messagesByConversation[action.payload]
      delete state.messagePaginationByConversation[action.payload]
      delete state.streamingStateByConversation[action.payload]
      if (state.activeConversationId === action.payload) {
        state.activeConversationId = null
        state.currentConversation = null
      }
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
      if (action.payload) {
        state.activeConversationId = action.payload.uniqueId
      }
    },
    setActiveConversationId: (state, action) => {
      state.activeConversationId = action.payload
    },

    setMessages: (state, action) => {
      const { conversationId, messages } = action.payload
      const cached = Object.keys(state.messagesByConversation)

      if (cached.length >= MAX_CACHED_CONVERSATIONS) {
        // Never evict the thread being written to, nor the one on screen.
        const evictable = cached.find(id => (
          id !== conversationId
          && id !== String(state.activeConversationId)
          && !state.streamingStateByConversation[id]
        ))
        if (evictable) delete state.messagesByConversation[evictable]
      }

      state.messagesByConversation[conversationId] = messages
    },
    prependMessages: (state, action) => {
      const { conversationId, messages } = action.payload
      const existing = state.messagesByConversation[conversationId] || []
      state.messagesByConversation[conversationId] = [...messages, ...existing]
    },
    addMessage: (state, action) => {
      const { conversationId, message } = action.payload
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = []
      }
      state.messagesByConversation[conversationId].push(message)
    },
    updateMessage: (state, action) => {
      const { conversationId, messageId, updates } = action.payload
      const messages = state.messagesByConversation[conversationId]
      if (!messages) return

      const index = messages.findIndex(m => m.id === messageId)
      if (index !== -1) {
        messages[index] = { ...messages[index], ...updates }
      }
    },
    removeMessage: (state, action) => {
      const { conversationId, messageId } = action.payload
      const messages = state.messagesByConversation[conversationId]
      if (!messages) return

      state.messagesByConversation[conversationId] = messages.filter(m => m.id !== messageId)
    },
    setMessagePagination: (state, action) => {
      const { conversationId, pagination } = action.payload
      state.messagePaginationByConversation[conversationId] = {
        ...state.messagePaginationByConversation[conversationId],
        ...pagination,
      }
    },

    setStreamingState: (state, action) => {
      const { conversationId, ...data } = action.payload
      state.streamingStateByConversation[conversationId] = {
        ...emptyStreamingState,
        ...state.streamingStateByConversation[conversationId],
        ...data,
      }
    },
    clearStreamingState: (state, action) => {
      delete state.streamingStateByConversation[action.payload]
    },

    setCurrentMode: (state, action) => {
      state.currentMode = action.payload
    },
    setConfig: (state, action) => {
      const { availableModes, costs, userInformation, researchProvider } = action.payload
      if (availableModes) state.availableModes = availableModes
      if (costs) state.costs = costs
      if (userInformation) state.userInformation = userInformation
      if (researchProvider) state.researchProvider = researchProvider
    },
    setUserSettings: (state, action) => {
      state.userSettings = { ...state.userSettings, ...action.payload }
    },

    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },

    resetState: () => initialState,
  },
  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading,
    }))
  },
})

export const { actions } = chatbotV2Slice
export default chatbotV2Slice.reducer

export const selectMessages = (state, conversationId) => (
  conversationId ? (state.chatbotV2.messagesByConversation[conversationId] || []) : []
)

export const selectStreamingState = (state, conversationId) => (
  conversationId ? (state.chatbotV2.streamingStateByConversation[conversationId] || null) : null
)
