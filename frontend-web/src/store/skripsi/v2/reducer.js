import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// How many tabs keep their message list in memory. A student moving between the
// researcher tabs should not refetch, but every tab ever opened must not
// accumulate either.
const MAX_CACHED_TABS = 10

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
  modeType: null,
}

const initialState = {
  sets: [],
  currentSet: null,
  activeTabId: null,

  // All keyed by tab id, so a stream keeps running — and keeps rendering into
  // the right tab — while the student reads or writes in another one.
  messagesByTab: {},
  messagePagingByTab: {},
  diagramsByTab: {},
  streamingStateByTab: {},
  loadingByTab: {},
  modeByTab: {},

  defaultMode: 'validated',
  availableModes: { research: true, validated: true },
  costs: { research: 0, validated: 0 },
  userInformation: { research: '', validated: '' },

  // V1 also carried `total` and `totalPages` here; the backend never returns
  // them (the project's pagination rule forbids it), so they were always 0.
  pagination: { page: 1, perPage: 20, isLastPage: false },
  filters: { search: '' },

  loading: {
    isBootstrapping: false,
    isFetchingSets: false,
    isLoadingMoreSets: false,
    isFetchingSet: false,
    isCreatingSet: false,
    isUpdatingSet: false,
    isDeletingSet: false,
    isSavingContent: false,
    isFetchingMessages: false,
    isFetchingDiagrams: false,
    isSavingDiagram: false,
    isGeneratingDiagram: false,
    isUpdatingResearchSettings: false,
  },
}

const skripsiV2Slice = createSlice({
  name: 'skripsiV2',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      const { key, value } = action.payload
      state.loading[key] = value
    },
    setTabLoading: (state, action) => {
      const { tabId, key, value } = action.payload
      if (!state.loadingByTab[tabId]) state.loadingByTab[tabId] = {}
      state.loadingByTab[tabId][key] = value
    },

    // ---- sets ----
    setSets: (state, action) => {
      state.sets = action.payload
    },
    appendSets: (state, action) => {
      state.sets = [...state.sets, ...action.payload]
    },
    addSet: (state, action) => {
      state.sets.unshift(action.payload)
    },
    updateSet: (state, action) => {
      const index = state.sets.findIndex(s => s.uniqueId === action.payload.uniqueId)
      if (index !== -1) {
        state.sets[index] = { ...state.sets[index], ...action.payload }
      }
      if (state.currentSet?.uniqueId === action.payload.uniqueId) {
        state.currentSet = { ...state.currentSet, ...action.payload }
      }
    },
    removeSet: (state, action) => {
      state.sets = state.sets.filter(s => s.uniqueId !== action.payload)
      if (state.currentSet?.uniqueId === action.payload) {
        state.currentSet = null
        state.activeTabId = null
      }
    },
    setCurrentSet: (state, action) => {
      state.currentSet = action.payload
      // Open on the first tab unless one is already chosen for this set.
      const tabs = action.payload?.tabs || []
      const stillValid = tabs.some(tab => tab.id === state.activeTabId)
      if (!stillValid) {
        state.activeTabId = tabs[0]?.id ?? null
      }
    },
    setActiveTabId: (state, action) => {
      state.activeTabId = action.payload
    },
    // Autosaved editor content: written straight onto the open set so the
    // editor does not refetch to see its own keystrokes.
    setEditorContent: (state, action) => {
      if (state.currentSet) {
        state.currentSet.editorContent = action.payload
      }
    },

    // ---- messages ----
    setMessages: (state, action) => {
      const { tabId, messages } = action.payload
      const cached = Object.keys(state.messagesByTab)

      if (cached.length >= MAX_CACHED_TABS) {
        // Never evict the tab being written to, nor the one on screen.
        const evictable = cached.find(id => (
          id !== String(tabId)
          && id !== String(state.activeTabId)
          && !state.streamingStateByTab[id]
        ))
        if (evictable) delete state.messagesByTab[evictable]
      }

      state.messagesByTab[tabId] = messages
    },
    prependMessages: (state, action) => {
      const { tabId, messages } = action.payload
      state.messagesByTab[tabId] = [...messages, ...(state.messagesByTab[tabId] || [])]
    },
    addMessage: (state, action) => {
      const { tabId, message } = action.payload
      if (!state.messagesByTab[tabId]) state.messagesByTab[tabId] = []
      state.messagesByTab[tabId].push(message)
    },
    updateMessage: (state, action) => {
      const { tabId, messageId, updates } = action.payload
      const messages = state.messagesByTab[tabId]
      if (!messages) return

      const index = messages.findIndex(m => m.id === messageId)
      if (index !== -1) {
        messages[index] = { ...messages[index], ...updates }
      }
    },
    removeMessage: (state, action) => {
      const { tabId, messageId } = action.payload
      const messages = state.messagesByTab[tabId]
      if (!messages) return

      state.messagesByTab[tabId] = messages.filter(m => m.id !== messageId)
    },
    // Keyset paging state: the oldest id on screen is the cursor for the next
    // page back, which is why this is not a page number.
    setMessagePaging: (state, action) => {
      const { tabId, hasMore, oldestMessageId } = action.payload
      state.messagePagingByTab[tabId] = {
        ...state.messagePagingByTab[tabId],
        ...(hasMore !== undefined && { hasMore }),
        ...(oldestMessageId !== undefined && { oldestMessageId }),
      }
    },

    // ---- diagrams ----
    setDiagrams: (state, action) => {
      const { tabId, diagrams } = action.payload
      state.diagramsByTab[tabId] = diagrams
    },
    addDiagram: (state, action) => {
      const { tabId, diagram } = action.payload
      state.diagramsByTab[tabId] = [diagram, ...(state.diagramsByTab[tabId] || [])]
    },

    // ---- streaming ----
    setStreamingState: (state, action) => {
      const { tabId, ...data } = action.payload
      state.streamingStateByTab[tabId] = {
        ...emptyStreamingState,
        ...state.streamingStateByTab[tabId],
        ...data,
      }
    },
    clearStreamingState: (state, action) => {
      delete state.streamingStateByTab[action.payload]
    },

    // ---- config ----
    setConfig: (state, action) => {
      const { availableModes, costs, userInformation } = action.payload
      if (availableModes) state.availableModes = availableModes
      if (costs) state.costs = costs
      if (userInformation) state.userInformation = userInformation
    },
    setModeForTab: (state, action) => {
      const { tabId, mode } = action.payload
      state.modeByTab[tabId] = mode
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

export const { actions } = skripsiV2Slice
export default skripsiV2Slice.reducer

// Selectors. Each takes the tab explicitly: a component always knows which tab
// it renders, and reading "the active tab" from inside a tab's own subtree is
// how V1 ended up re-rendering every tab on any tab's change.
export const selectMessagesForTab = (state, tabId) => (
  tabId ? (state.skripsiV2.messagesByTab[tabId] || []) : []
)

export const selectDiagramsForTab = (state, tabId) => (
  tabId ? (state.skripsiV2.diagramsByTab[tabId] || []) : []
)

export const selectStreamingStateForTab = (state, tabId) => (
  tabId ? (state.skripsiV2.streamingStateByTab[tabId] || null) : null
)

export const selectModeForTab = (state, tabId) => (
  state.skripsiV2.modeByTab[tabId] || state.skripsiV2.defaultMode
)

export const selectPagingForTab = (state, tabId) => (
  state.skripsiV2.messagePagingByTab[tabId] || { hasMore: false, oldestMessageId: null }
)
