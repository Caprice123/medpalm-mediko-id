import { createSlice } from '@reduxjs/toolkit'
import { resetAllState } from '../../globalAction'

// Deliberately a separate slice from the user-facing `chatbotV2`. V1 shared one
// `chatbot` slice between the admin panel and the student chat, so the admin
// list read the same `pagination` object the chat page was writing to — opening
// the panel after chatting started on whatever page the chat had left behind.
const initialState = {
  conversations: [],
  messages: [],
  researchImplementations: { constantKey: null, current: null, options: [] },
  // The trusted-domain and journal-name lists the research mode filters on.
  // V1 kept these — and their loading flags — in component-local useState, so
  // nothing outside the tab could read them and the project's "loading lives in
  // Redux" rule did not hold.
  domains: [],
  journals: [],
  filters: { search: '', userId: '' },
  domainFilters: { search: '' },
  journalFilters: { search: '' },
  pagination: { page: 1, perPage: 20, isLastPage: false },
  messagePagination: { page: 1, perPage: 50, isLastPage: false },
  domainPagination: { page: 1, perPage: 12, isLastPage: false },
  journalPagination: { page: 1, perPage: 20, isLastPage: false },
  loading: {
    isFetchingConversations: false,
    isLoadingMoreConversations: false,
    isFetchingMessages: false,
    isDeletingConversation: false,
    isFetchingResearchImplementations: false,
    isFetchingDomains: false,
    isLoadingMoreDomains: false,
    isSavingDomain: false,
    isFetchingJournals: false,
    isLoadingMoreJournals: false,
    isSavingJournal: false,
  },
}

const chatbotAdminV2Slice = createSlice({
  name: 'chatbotAdminV2',
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
    removeConversation: (state, action) => {
      state.conversations = state.conversations.filter(c => c.uniqueId !== action.payload)
    },

    setMessages: (state, action) => {
      state.messages = action.payload
    },
    prependMessages: (state, action) => {
      state.messages = [...action.payload, ...state.messages]
    },

    setResearchImplementations: (state, action) => {
      state.researchImplementations = action.payload
    },

    setDomains: (state, action) => {
      state.domains = action.payload
    },
    appendDomains: (state, action) => {
      state.domains = [...state.domains, ...action.payload]
    },
    setJournals: (state, action) => {
      state.journals = action.payload
    },
    appendJournals: (state, action) => {
      state.journals = [...state.journals, ...action.payload]
    },

    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload }
    },
    setMessagePagination: (state, action) => {
      state.messagePagination = { ...state.messagePagination, ...action.payload }
    },
    setDomainPagination: (state, action) => {
      state.domainPagination = { ...state.domainPagination, ...action.payload }
    },
    setJournalPagination: (state, action) => {
      state.journalPagination = { ...state.journalPagination, ...action.payload }
    },
    updateFilter: (state, action) => {
      const { key, value } = action.payload
      state.filters[key] = value
    },
    updateDomainFilter: (state, action) => {
      const { key, value } = action.payload
      state.domainFilters[key] = value
    },
    updateJournalFilter: (state, action) => {
      const { key, value } = action.payload
      state.journalFilters[key] = value
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

export const { actions } = chatbotAdminV2Slice
export default chatbotAdminV2Slice.reducer
