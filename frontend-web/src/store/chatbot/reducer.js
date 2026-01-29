import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  conversations: [],
  currentConversation: null,
  messagesByConversation: {}, // Store messages per conversation ID: { [conversationId]: [...messages] }
  activeConversationId: null, // Track which conversation is currently active
  streamingStateByConversation: {}, // { [conversationId]: { realMessageId, displayedLength } }
  currentMode: 'normal',
  availableModes: {
    normal: true,
    validated: true,
    research: true
  },
  costs: {
    normal: 5,
    validated: 8,
    research: 15
  },
  userInformation: {
    normal: '',
    validated: '',
    research: ''
  },
  filters: {
    search: '',
    userId: ''
  },
  pagination: {
    page: 1,
    perPage: 20,
    isLastPage: false
  },
  loading: {
    isConversationsLoading: false,
    isCurrentConversationLoading: false,
    isMessagesLoading: false,
    isSendingMessage: false,
    isConstantsLoading: false,
    isUpdatingConstants: false
  },
  error: null
}

const chatbotSlice = createSlice({
  name: 'chatbot',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setConversations: (state, action) => {
      state.conversations = action.payload
    },
    setCurrentConversation: (state, action) => {
      state.currentConversation = action.payload
      // Also set as active conversation
      if (action.payload) {
        state.activeConversationId = action.payload.id
      }
    },
    setActiveConversationId: (state, action) => {
      state.activeConversationId = action.payload
    },
    // New conversation-aware message actions
    setMessagesForConversation: (state, action) => {
      const { conversationId, messages } = action.payload

      // Cache management: Keep max 10 conversations in memory
      const MAX_CACHED_CONVERSATIONS = 10
      const cachedConversationIds = Object.keys(state.messagesByConversation)

      if (cachedConversationIds.length >= MAX_CACHED_CONVERSATIONS) {
        // Remove oldest conversation (not the current one)
        const oldestId = cachedConversationIds.find(id => id !== conversationId && id !== String(state.activeConversationId))
        if (oldestId) {
          delete state.messagesByConversation[oldestId]
        }
      }

      state.messagesByConversation[conversationId] = messages
    },
    addMessageToConversation: (state, action) => {
      const { conversationId, message } = action.payload
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = []
      }
      state.messagesByConversation[conversationId].push(message)
    },
    updateMessageInConversation: (state, action) => {
      const { conversationId, messageId, updates } = action.payload
      const messages = state.messagesByConversation[conversationId]
      if (messages) {
        const index = messages.findIndex(m => m.id === messageId)
        if (index !== -1) {
          state.messagesByConversation[conversationId][index] = {
            ...messages[index],
            ...updates
          }
        }
      }
    },
    removeMessageFromConversation: (state, action) => {
      const { conversationId, messageId } = action.payload
      const messages = state.messagesByConversation[conversationId]
      if (messages) {
        state.messagesByConversation[conversationId] = messages.filter(m => m.id !== messageId)
      }
    },
    prependMessagesToConversation: (state, action) => {
      const { conversationId, messages } = action.payload
      if (!state.messagesByConversation[conversationId]) {
        state.messagesByConversation[conversationId] = messages
      } else {
        state.messagesByConversation[conversationId] = [
          ...messages,
          ...state.messagesByConversation[conversationId]
        ]
      }
    },
    setStreamingState: (state, action) => {
      const { conversationId, ...streamingData } = action.payload
      if (!state.streamingStateByConversation[conversationId]) {
        state.streamingStateByConversation[conversationId] = {
          isSending: false,
          isTyping: false,
          userStopped: false,
          userMessage: null,
          streamingMessageId: null,
          optimisticUserId: null,
          realMessageId: null,
          realUserMessageId: null,
          displayedContent: '',
          displayedLength: 0,
          mode: null
        }
      }
      // Merge new data into existing state
      state.streamingStateByConversation[conversationId] = {
        ...state.streamingStateByConversation[conversationId],
        ...streamingData
      }
    },
    clearStreamingState: (state, action) => {
      const conversationId = action.payload
      delete state.streamingStateByConversation[conversationId]
    },
    // Legacy actions - for backward compatibility, operate on active conversation
    setMessages: (state, action) => {
      if (state.activeConversationId) {
        state.messagesByConversation[state.activeConversationId] = action.payload
      }
    },
    addMessage: (state, action) => {
      if (state.activeConversationId) {
        if (!state.messagesByConversation[state.activeConversationId]) {
          state.messagesByConversation[state.activeConversationId] = []
        }
        state.messagesByConversation[state.activeConversationId].push(action.payload)
      }
    },
    updateMessage: (state, action) => {
      if (state.activeConversationId) {
        const messages = state.messagesByConversation[state.activeConversationId]
        if (messages) {
          const index = messages.findIndex(m => m.id === action.payload.id)
          if (index !== -1) {
            state.messagesByConversation[state.activeConversationId][index] = { ...action.payload }
          }
        }
      }
    },
    removeMessage: (state, action) => {
      if (state.activeConversationId) {
        const messages = state.messagesByConversation[state.activeConversationId]
        if (messages) {
          state.messagesByConversation[state.activeConversationId] = messages.filter(m => m.id !== action.payload)
        }
      }
    },
    prependMessages: (state, action) => {
      if (state.activeConversationId) {
        if (!state.messagesByConversation[state.activeConversationId]) {
          state.messagesByConversation[state.activeConversationId] = action.payload
        } else {
          state.messagesByConversation[state.activeConversationId] = [
            ...action.payload,
            ...state.messagesByConversation[state.activeConversationId]
          ]
        }
      }
    },
    resetMessages: (state) => {
      // Reset messages for active conversation
      if (state.activeConversationId) {
        state.messagesByConversation[state.activeConversationId] = []
      }
      state.pagination = {
        page: 1,
        perPage: 50,
        isLastPage: false
      }
    },
    setCurrentMode: (state, action) => {
      state.currentMode = action.payload
    },
    setAvailableModes: (state, action) => {
      state.availableModes = action.payload
    },
    setCosts: (state, action) => {
      state.costs = action.payload
    },
    setUserInformation: (state, action) => {
      state.userInformation = action.payload
    },
    setPagination: (state, action) => {
      state.pagination = action.payload
    },
    setPage: (state, action) => {
      state.pagination.page = action.payload
    },
    addConversation: (state, action) => {
      state.conversations.unshift(action.payload)
    },
    updateConversation: (state, action) => {
      const index = state.conversations.findIndex(c => c.id === action.payload.id)
      if (index !== -1) {
        state.conversations[index] = action.payload
      }
    },
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c.id !== action.payload)
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
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
        loading: state.loading, // 🔥 preserve current loading state
    }));
},
})

export const { actions } = chatbotSlice
export default chatbotSlice.reducer

// Selectors
export const selectMessagesForCurrentConversation = (state) => {
  const conversationId = state.chatbot.activeConversationId
  return conversationId ? (state.chatbot.messagesByConversation[conversationId] || []) : []
}

export const selectMessagesForConversation = (state, conversationId) => {
  return state.chatbot.messagesByConversation[conversationId] || []
}
