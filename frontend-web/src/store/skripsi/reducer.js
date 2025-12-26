import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../globalAction'

const initialState = {
  sets: [],
  currentSet: null,
  currentTab: null,
  loading: {
    isSetsLoading: false,
    isSetLoading: false,
    isSendingMessage: false,
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
        state.currentSet.editor_content = editorContent
      }
      // Also update in sets list
      const setIndex = state.sets.findIndex(s => s.id === setId)
      if (setIndex !== -1) {
        state.sets[setIndex].editor_content = editorContent
      }
    },
    addMessage: (state, action) => {
      const { tabId, message } = action.payload
      if (state.currentSet) {
        const tab = state.currentSet.tabs.find(t => t.id === tabId)
        if (tab) {
          if (!tab.messages) tab.messages = []
          tab.messages.push(message)
        }
      }
      // Also update currentTab if it matches
      if (state.currentTab && state.currentTab.id === tabId) {
        if (!state.currentTab.messages) state.currentTab.messages = []
        state.currentTab.messages.push(message)
      }
    },
    prependMessages: (state, action) => {
      const { tabId, messages } = action.payload
      if (state.currentSet) {
        const tab = state.currentSet.tabs.find(t => t.id === tabId)
        if (tab) {
          if (!tab.messages) tab.messages = []
          tab.messages = [...messages, ...tab.messages]
        }
      }
      // Also update currentTab if it matches
      if (state.currentTab && state.currentTab.id === tabId) {
        if (!state.currentTab.messages) state.currentTab.messages = []
        state.currentTab.messages = [...messages, ...state.currentTab.messages]
      }
    },
    removeMessage: (state, action) => {
      const { tabId, messageId } = action.payload
      if (state.currentSet) {
        const tab = state.currentSet.tabs.find(t => t.id === tabId)
        if (tab && tab.messages) {
          tab.messages = tab.messages.filter(m => m.id !== messageId)
        }
      }
      if (state.currentTab && state.currentTab.id === tabId && state.currentTab.messages) {
        state.currentTab.messages = state.currentTab.messages.filter(m => m.id !== messageId)
      }
    },
    updateMessage: (state, action) => {
      const { tabId, messageId, content } = action.payload
      if (state.currentSet) {
        const tab = state.currentSet.tabs.find(t => t.id === tabId)
        if (tab && tab.messages) {
          const message = tab.messages.find(m => m.id === messageId)
          if (message) {
            message.content = content
          }
        }
      }
      if (state.currentTab && state.currentTab.id === tabId && state.currentTab.messages) {
        const message = state.currentTab.messages.find(m => m.id === messageId)
        if (message) {
          message.content = content
        }
      }
    },
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
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
