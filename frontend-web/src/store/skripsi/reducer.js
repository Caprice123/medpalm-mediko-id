import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  sets: [],
  currentSet: null,
  currentTab: null,
  messagesByTab: {}, // Store messages per tab ID: { [tabId]: [...messages] }
  diagramsByTab: {}, // Store diagrams per tab ID: { [tabId]: [...diagrams] }
  streamingStateByTab: {}, // Store streaming state per tab: { [tabId]: { isSending, isTyping, displayedContent, etc. } }
  activeTabId: null, // Track which tab is currently active
  loadingByTab: {}, // Store loading states per tab: { [tabId]: { isSendingMessage: false } }
  loading: {
    isSetsLoading: false,
    isSetLoading: false,
    isAdminSetLoading: false,
    isTabMessagesLoading: false,
    isSavingContent: false,
  },
  pagination: {
    page: 1,
    perPage: 20,
    total: 0,
    totalPages: 0,
    isLastPage: false
  },
  filters: {
    search: '',
    userId: ''
  },
  error: null
}

const skripsiSlice = createSlice({
  name: 'skripsi',
  initialState,
  reducers: {
    setSets: (state, action) => {
      state.sets = action.payload
    },
    setCurrentSet: (state, action) => {
      state.currentSet = action.payload
    },
    setCurrentTab: (state, action) => {
      state.currentTab = action.payload
      // Also set as active tab
      if (action.payload) {
        state.activeTabId = action.payload.id
      }
    },
    setActiveTabId: (state, action) => {
      state.activeTabId = action.payload
    },
    addSet: (state, action) => {
      state.sets.unshift(action.payload)
    },
    updateSet: (state, action) => {
      const index = state.sets.findIndex(s => s.id === action.payload.id)
      if (index !== -1) {
        state.sets[index] = action.payload
      }
      if (state.currentSet?.id === action.payload.id) {
        state.currentSet = { ...state.currentSet, ...action.payload }
      }
    },
    removeSet: (state, action) => {
      state.sets = state.sets.filter(s => s.id !== action.payload)
      if (state.currentSet?.id === action.payload) {
        state.currentSet = null
      }
    },
    updateSetContent: (state, action) => {
      const { setId, editorContent } = action.payload
      if (state.currentSet && state.currentSet.id === setId) {
        state.currentSet.editorContent = editorContent
      }
      // Also update in sets list
      const setIndex = state.sets.findIndex(s => s.id === setId)
      if (setIndex !== -1) {
        state.sets[setIndex].editorContent = editorContent
      }
    },
    // New tab-aware message actions (similar to chatbot's conversation-aware actions)
    setMessagesForTab: (state, action) => {
      const { tabId, messages } = action.payload

      // Cache management: Keep max 10 tabs in memory
      const MAX_CACHED_TABS = 10
      const cachedTabIds = Object.keys(state.messagesByTab)

      if (cachedTabIds.length >= MAX_CACHED_TABS) {
        // Remove oldest tab (not the current one)
        const oldestId = cachedTabIds.find(id => id !== tabId && id !== String(state.activeTabId))
        if (oldestId) {
          delete state.messagesByTab[oldestId]
        }
      }

      state.messagesByTab[tabId] = messages
    },
    addMessageToTab: (state, action) => {
      const { tabId, message } = action.payload
      if (!state.messagesByTab[tabId]) {
        state.messagesByTab[tabId] = []
      }
      state.messagesByTab[tabId].push(message)
    },
    updateMessageInTab: (state, action) => {
      const { tabId, messageId, updates } = action.payload
      const messages = state.messagesByTab[tabId]
      if (messages) {
        const index = messages.findIndex(m => m.id === messageId)
        if (index !== -1) {
          state.messagesByTab[tabId][index] = {
            ...messages[index],
            ...updates
          }
        }
      }
    },
    removeMessageFromTab: (state, action) => {
      const { tabId, messageId } = action.payload
      const messages = state.messagesByTab[tabId]
      if (messages) {
        state.messagesByTab[tabId] = messages.filter(m => m.id !== messageId)
      }
    },
    prependMessagesToTab: (state, action) => {
      const { tabId, messages } = action.payload
      if (!state.messagesByTab[tabId]) {
        state.messagesByTab[tabId] = messages
      } else {
        state.messagesByTab[tabId] = [
          ...messages,
          ...state.messagesByTab[tabId]
        ]
      }
    },
    // Diagram actions for tabs
    setDiagramsForTab: (state, action) => {
      const { tabId, diagrams } = action.payload
      state.diagramsByTab[tabId] = diagrams
    },
    resetTabMessages: (state) => {
      // Reset messages for active tab
      if (state.activeTabId) {
        state.messagesByTab[state.activeTabId] = []
      }
    },
    // Streaming state actions per tab
    setStreamingState: (state, action) => {
      const { tabId, ...streamingData } = action.payload
      if (!state.streamingStateByTab[tabId]) {
        state.streamingStateByTab[tabId] = {
          isSending: false,
          isTyping: false,
          userStopped: false,
          userMessage: null,
          streamingMessageId: null,
          optimisticUserId: null,
          realMessageId: null,
          realUserMessageId: null,
          displayedContent: '',
          displayedLength: 0
        }
      }
      // Merge new data into existing state
      state.streamingStateByTab[tabId] = {
        ...state.streamingStateByTab[tabId],
        ...streamingData
      }
    },
    clearStreamingState: (state, action) => {
      const tabId = action.payload
      delete state.streamingStateByTab[tabId]
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setTabLoading: (state, action) => {
      const { tabId, key, value } = action.payload
      if (!state.loadingByTab[tabId]) {
        state.loadingByTab[tabId] = {}
      }
      state.loadingByTab[tabId][key] = value
    },
    setPagination: (state, action) => {
      state.pagination = action.payload
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    clearError: (state) => {
      state.error = null
    }
  },

  extraReducers: (builder) => {
    builder.addCase(resetAllState, (state) => ({
      ...initialState,
      loading: state.loading, // 🔥 preserve current loading state
    }));
  },
})

export const { actions } = skripsiSlice
export default skripsiSlice.reducer

// Selectors
export const selectMessagesForActiveTab = (state) => {
  const tabId = state.skripsi.activeTabId
  return tabId ? (state.skripsi.messagesByTab[tabId] || []) : []
}

export const selectMessagesForTab = (state, tabId) => {
  return state.skripsi.messagesByTab[tabId] || []
}

export const selectDiagramsForActiveTab = (state) => {
  const tabId = state.skripsi.activeTabId
  return tabId ? (state.skripsi.diagramsByTab[tabId] || []) : []
}

export const selectDiagramsForTab = (state, tabId) => {
  return state.skripsi.diagramsByTab[tabId] || []
}

export const selectLoadingForActiveTab = (state) => {
  const tabId = state.skripsi.activeTabId
  return tabId ? (state.skripsi.loadingByTab[tabId] || {}) : {}
}

export const selectLoadingForTab = (state, tabId) => {
  return state.skripsi.loadingByTab[tabId] || {}
}
