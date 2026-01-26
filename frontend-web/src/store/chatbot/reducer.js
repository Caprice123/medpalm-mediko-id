import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  conversations: [],
  currentConversation: null,
  messages: [],
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
    },
    setMessages: (state, action) => {
      state.messages = action.payload
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload)
    },
    updateMessage: (state, action) => {
      const index = state.messages.findIndex(m => m.id === action.payload.id)
      if (index !== -1) {
        // Redux Toolkit uses Immer, so this mutation is safe and creates a new reference
        state.messages[index] = { ...action.payload }
      }
    },
    removeMessage: (state, action) => {
      state.messages = state.messages.filter(m => m.id !== action.payload)
    },
    prependMessages: (state, action) => {
      // Prepend older messages at the beginning for pagination
      state.messages = [...action.payload, ...state.messages]
    },
    resetMessages: (state) => {
      // Reset messages when switching conversations
      state.messages = []
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
