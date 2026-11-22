import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// How many tabs keep their message list in memory. A student moving between the
// researcher tabs should not refetch, but every tab ever opened must not
// accumulate either.
const MAX_CACHED_TABS = 10

// What a chat tab attaches before the student touches anything. The case is
// cheap and is almost always what makes an answer about this report rather
// than about PBL reports in general; the reference list and whole sections are
// opt-in because they are what actually costs tokens.
export const DEFAULT_CHAT_CONTEXT = { case: true, citations: false, sectionIds: [] }

// Matches the cap the server enforces in skripsiReportContextV2. Three whole
// sections is already most of a model's attention; past that the question
// itself starts losing.
export const MAX_CONTEXT_SECTIONS = 3

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

  // The report templates offered on "Buat laporan baru", and the sections of
  // the report currently open in the editor.
  templates: [],
  sections: [],
  // The group the open report belongs to.
  members: [],

  // The Searcher panel's last run: its results and the raw Perplexity
  // response behind them, which the panel can show verbatim.
  searchResults: [],
  searchRaw: null,

  // The sources kept for the open report's daftar pustaka, each already
  // formatted by the server in `citationStyle` — the panel never formats a
  // citation itself, so what it lists is exactly what a generate would write.
  citations: [],
  citationStyle: 'vancouver',
  citationStyles: [],

  // The admin panel's own copy of the templates, with its own paging: it lists
  // inactive templates too, which the student-facing list never carries.
  adminTemplates: [],
  adminTemplatesPagination: { page: 1, perPage: 20, isLastPage: false },
  // Filtering is the server's job: this is read when the list is fetched, not
  // applied to rows already on screen.
  adminTemplatesFilter: { search: '' },
  // The one template the edit form is open on, with its outline. The listing
  // rows do not carry sections, so the form reads what it edits.
  adminTemplateDetail: null,
  // Each section autosaves on its own, so "is this saving" is per section
  // rather than one flag for the whole document.
  savingSectionIds: {},

  // All keyed by tab id, so a stream keeps running — and keeps rendering into
  // the right tab — while the student reads or writes in another one.
  messagesByTab: {},
  messagePagingByTab: {},
  diagramsByTab: {},
  streamingStateByTab: {},
  loadingByTab: {},
  modeByTab: {},
  // What each chat tab attaches to its next message: the PBL case, the
  // reference list, and up to a few sections in full. Per tab and in memory
  // only: a choice about the next question, not a property of the report.
  chatContextByTab: {},

  // Only ever used to label the message that is still streaming: the server
  // picks the mode off the tab and the persisted row carries the real one.
  defaultMode: 'normal',
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
    isFetchingTemplates: false,
    isFetchingSections: false,
    isCreatingSection: false,
    isFetchingMembers: false,
    isSavingMembers: false,
    isSearching: false,
    isFetchingCitations: false,
    isSavingCitation: false,
    isUpdatingCitation: false,
    isDeletingCitation: false,
    isGeneratingBibliography: false,
    isDeletingSection: false,
    isReorderingSections: false,
    isEditingTextWithAi: false,
    isAssistingSection: false,
    isFetchingAdminTemplates: false,
    isFetchingAdminTemplateDetail: false,
    isSavingTemplate: false,
    isDeletingTemplate: false,
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

    // ---- report templates ----
    setTemplates: (state, action) => {
      state.templates = action.payload
    },

    // ---- admin: report templates ----
    setAdminTemplates: (state, action) => {
      state.adminTemplates = action.payload
    },
    appendAdminTemplates: (state, action) => {
      state.adminTemplates = [...state.adminTemplates, ...action.payload]
    },
    setAdminTemplatesPagination: (state, action) => {
      state.adminTemplatesPagination = { ...state.adminTemplatesPagination, ...action.payload }
    },
    updateAdminTemplatesFilter: (state, action) => {
      const { key, value } = action.payload
      state.adminTemplatesFilter[key] = value
    },
    setAdminTemplateDetail: (state, action) => {
      state.adminTemplateDetail = action.payload
    },

    // ---- group members ----
    setMembers: (state, action) => {
      state.members = action.payload
    },

    // ---- searcher ----
    setSearchResult: (state, action) => {
      state.searchResults = action.payload?.results || []
      state.searchRaw = action.payload?.raw || null
    },
    clearSearchResult: (state) => {
      state.searchResults = []
      state.searchRaw = null
    },

    // ============= Citations =============

    setCitations: (state, action) => {
      state.citations = action.payload?.citations || []
      if (action.payload?.style) state.citationStyle = action.payload.style
      if (action.payload?.styles) state.citationStyles = action.payload.styles
    },
    // The style the dropdown is on, before a generate has been asked for.
    setCitationStyle: (state, action) => {
      state.citationStyle = action.payload
    },

    // ---- sections ----
    setSections: (state, action) => {
      state.sections = action.payload
    },
    addSection: (state, action) => {
      state.sections = [...state.sections, action.payload]
        .sort((a, b) => a.position - b.position)
    },
    updateSection: (state, action) => {
      const index = state.sections.findIndex(section => section.id === action.payload.id)
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], ...action.payload }
      }
    },
    // A rewrite that did not come from the student's own typing — today only
    // "Kumpulkan referensi". The bumped revision is what tells that section's
    // editor to pick the new content up; an ordinary autosave must never do
    // this, or the cursor would jump on every keystroke.
    replaceSectionContent: (state, action) => {
      const index = state.sections.findIndex(section => section.id === action.payload.id)
      if (index !== -1) {
        state.sections[index] = {
          ...state.sections[index],
          ...action.payload,
          contentRevision: (state.sections[index].contentRevision ?? 0) + 1,
        }
      }
    },
    // Swaps the placeholder a new section was shown as for the row the server
    // actually created. Everything the student may have typed into it in the
    // meantime is kept: only the id, and whatever the server decided, change.
    replaceSection: (state, action) => {
      const { tempId, section } = action.payload
      const index = state.sections.findIndex(item => item.id === tempId)
      if (index !== -1) {
        state.sections[index] = { ...state.sections[index], ...section }
      }
    },
    removeSection: (state, action) => {
      state.sections = state.sections
        .filter(section => section.id !== action.payload)
        .map((section, index) => ({ ...section, position: index }))
    },
    setSectionSaving: (state, action) => {
      const { sectionId, value } = action.payload
      if (value) {
        state.savingSectionIds[sectionId] = true
      } else {
        delete state.savingSectionIds[sectionId]
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

    // ---- chat context ----
    setChatContext: (state, action) => {
      const { tabId, context } = action.payload
      state.chatContextByTab[tabId] = { ...DEFAULT_CHAT_CONTEXT, ...state.chatContextByTab[tabId], ...context }
    },

    // Ticking one section on or off, resolved here against the live selection
    // rather than computed in the component. The shared Checkbox only
    // re-renders when its own checked state changes, so a row that was left
    // alone is still holding the selection as it was when that row last
    // rendered — handing that list back would drop whatever was attached since.
    toggleChatContextSection: (state, action) => {
      const { tabId, sectionId } = action.payload
      const current = state.chatContextByTab[tabId] || DEFAULT_CHAT_CONTEXT

      // A section that was attached and then deleted from the report still
      // counts against the cap unless it is dropped here, which would leave a
      // tick that does nothing and never says why.
      const attachedIds = current.sectionIds.filter(
        id => state.sections.some(section => section.id === id)
      )
      const attached = attachedIds.includes(sectionId)

      if (!attached && attachedIds.length >= MAX_CONTEXT_SECTIONS) return

      state.chatContextByTab[tabId] = {
        ...DEFAULT_CHAT_CONTEXT,
        ...current,
        sectionIds: attached
          ? attachedIds.filter(id => id !== sectionId)
          : [...attachedIds, sectionId],
      }
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

export const selectChatContext = (state, tabId) => (
  state.skripsiV2.chatContextByTab[tabId] || DEFAULT_CHAT_CONTEXT
)

export const selectPagingForTab = (state, tabId) => (
  state.skripsiV2.messagePagingByTab[tabId] || { hasMore: false, oldestMessageId: null }
)
