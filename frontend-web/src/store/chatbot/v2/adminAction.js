import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'
import { actions } from './adminReducer'

const base = Endpoints.admin.chatbotV2

// ============= Conversations =============

// Reads whichever page the reducer points at, like every other V2 admin list.
// Admin lists accumulate, so `append` picks between replacing and adding.
export const fetchAdminConversations = ({ append = false } = {}) => async (dispatch, getState) => {
  const loadingKey = append ? 'isLoadingMoreConversations' : 'isFetchingConversations'

  try {
    dispatch(actions.setLoading({ key: loadingKey, value: true }))

    const { pagination, filters } = getState().chatbotAdminV2
    const response = await getWithToken(`${base}/conversations`, {
      page: pagination.page,
      perPage: pagination.perPage,
      ...(filters.search ? { search: filters.search } : {}),
      ...(filters.userId ? { userId: filters.userId } : {}),
    })

    const conversations = response.data.data || []
    dispatch(append ? actions.appendConversations(conversations) : actions.setConversations(conversations))

    if (response.data.pagination) {
      dispatch(actions.setPagination(response.data.pagination))
    }
  } finally {
    dispatch(actions.setLoading({ key: loadingKey, value: false }))
  }
}

export const loadMoreAdminConversations = () => (dispatch, getState) => {
  const { pagination, loading } = getState().chatbotAdminV2
  if (pagination.isLastPage || loading.isLoadingMoreConversations) return

  dispatch(actions.setPagination({ page: pagination.page + 1 }))
  return dispatch(fetchAdminConversations({ append: true }))
}

export const reloadAdminConversations = () => (dispatch) => {
  dispatch(actions.setPagination({ page: 1 }))
  return dispatch(fetchAdminConversations())
}

export const fetchAdminConversationMessages = (conversationId, { prepend = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingMessages', value: true }))

    const pagination = getState().chatbotAdminV2.messagePagination
    const response = await getWithToken(`${base}/conversations/${conversationId}/messages`, {
      page: pagination.page,
      perPage: pagination.perPage,
    })

    // Newest-first from the backend; reversed so the reader runs oldest to newest.
    const messages = (response.data.data || []).slice().reverse()
    dispatch(prepend ? actions.prependMessages(messages) : actions.setMessages(messages))

    if (response.data.pagination) {
      dispatch(actions.setMessagePagination(response.data.pagination))
    }
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingMessages', value: false }))
  }
}

export const openAdminConversation = (conversationId) => (dispatch) => {
  dispatch(actions.setMessagePagination({ page: 1, isLastPage: false }))
  dispatch(actions.setMessages([]))
  return dispatch(fetchAdminConversationMessages(conversationId))
}

export const loadMoreAdminConversationMessages = (conversationId) => (dispatch, getState) => {
  const { messagePagination, loading } = getState().chatbotAdminV2
  if (messagePagination.isLastPage || loading.isFetchingMessages) return

  dispatch(actions.setMessagePagination({ page: messagePagination.page + 1 }))
  return dispatch(fetchAdminConversationMessages(conversationId, { prepend: true }))
}

export const deleteAdminConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingConversation', value: true }))

    await deleteWithToken(`${base}/conversations/${conversationId}`)
    dispatch(actions.removeConversation(conversationId))
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingConversation', value: false }))
  }
}

// ============= Research implementation =============

// Which implementation answers a research message. The options are served by the
// backend registry rather than hardcoded here, so the panel can never offer a
// key the backend would reject.
export const fetchResearchImplementations = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isFetchingResearchImplementations', value: true }))

    const response = await getWithToken(`${base}/research-implementations`)
    dispatch(actions.setResearchImplementations(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isFetchingResearchImplementations', value: false }))
  }
}

// ============= Research domains =============

// A trusted domain carries the journal name the research filter actually
// matches on, which is why create and edit always deal in the pair.
export const fetchAdminDomains = ({ append = false } = {}) => async (dispatch, getState) => {
  const loadingKey = append ? 'isLoadingMoreDomains' : 'isFetchingDomains'

  try {
    dispatch(actions.setLoading({ key: loadingKey, value: true }))

    const { domainPagination, domainFilters } = getState().chatbotAdminV2
    const response = await getWithToken(`${base}/research-domains`, {
      page: domainPagination.page,
      perPage: domainPagination.perPage,
      ...(domainFilters.search ? { search: domainFilters.search } : {}),
    })

    const { domains = [], pagination } = response.data.data || {}
    dispatch(append ? actions.appendDomains(domains) : actions.setDomains(domains))
    if (pagination) dispatch(actions.setDomainPagination(pagination))
  } finally {
    dispatch(actions.setLoading({ key: loadingKey, value: false }))
  }
}

export const loadMoreAdminDomains = () => (dispatch, getState) => {
  const { domainPagination, loading } = getState().chatbotAdminV2
  if (domainPagination.isLastPage || loading.isLoadingMoreDomains) return

  dispatch(actions.setDomainPagination({ page: domainPagination.page + 1 }))
  return dispatch(fetchAdminDomains({ append: true }))
}

export const reloadAdminDomains = () => (dispatch) => {
  dispatch(actions.setDomainPagination({ page: 1 }))
  return dispatch(fetchAdminDomains())
}

export const createAdminDomain = (domain, journalName) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: true }))
    await postWithToken(`${base}/research-domains`, { domain, journal_name: journalName })
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: false }))
  }

  return dispatch(reloadAdminDomains())
}

export const updateAdminDomain = (id, payload) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: true }))
    await putWithToken(`${base}/research-domains/${id}`, payload)
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: false }))
  }

  return dispatch(reloadAdminDomains())
}

export const deleteAdminDomain = (id) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: true }))
    await deleteWithToken(`${base}/research-domains/${id}`)
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingDomain', value: false }))
  }

  // Removing a row shifts every later one up a place, so an accumulated list
  // has to start again from page 1 rather than keep its page counter.
  return dispatch(reloadAdminDomains())
}

// ============= Journal names =============

export const fetchAdminJournals = ({ append = false } = {}) => async (dispatch, getState) => {
  const loadingKey = append ? 'isLoadingMoreJournals' : 'isFetchingJournals'

  try {
    dispatch(actions.setLoading({ key: loadingKey, value: true }))

    const { journalPagination, journalFilters } = getState().chatbotAdminV2
    const response = await getWithToken(`${base}/journals`, {
      page: journalPagination.page,
      perPage: journalPagination.perPage,
      ...(journalFilters.search ? { search: journalFilters.search } : {}),
    })

    const { journals = [], pagination } = response.data.data || {}
    dispatch(append ? actions.appendJournals(journals) : actions.setJournals(journals))
    if (pagination) dispatch(actions.setJournalPagination(pagination))
  } finally {
    dispatch(actions.setLoading({ key: loadingKey, value: false }))
  }
}

export const loadMoreAdminJournals = () => (dispatch, getState) => {
  const { journalPagination, loading } = getState().chatbotAdminV2
  if (journalPagination.isLastPage || loading.isLoadingMoreJournals) return

  dispatch(actions.setJournalPagination({ page: journalPagination.page + 1 }))
  return dispatch(fetchAdminJournals({ append: true }))
}

export const reloadAdminJournals = () => (dispatch) => {
  dispatch(actions.setJournalPagination({ page: 1 }))
  return dispatch(fetchAdminJournals())
}

export const createAdminJournal = (name) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: true }))
    await postWithToken(`${base}/journals`, { name })
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: false }))
  }

  return dispatch(reloadAdminJournals())
}

export const updateAdminJournal = (id, payload) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: true }))
    await putWithToken(`${base}/journals/${id}`, payload)
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: false }))
  }

  return dispatch(reloadAdminJournals())
}

export const deleteAdminJournal = (id) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: true }))
    await deleteWithToken(`${base}/journals/${id}`)
  } finally {
    dispatch(actions.setLoading({ key: 'isSavingJournal', value: false }))
  }

  return dispatch(reloadAdminJournals())
}
