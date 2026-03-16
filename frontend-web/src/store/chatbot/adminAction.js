import { actions } from '@store/chatbot/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setConversations,
  setCurrentConversation,
  setMessages,
  setPagination,
  setMessagePaginationForConversation,
  removeConversation,
  setUserSettings,
} = actions

// ============= Research Domain Management =============

export const fetchResearchDomains = ({ page = 1, perPage = 12, search = '' } = {}) => async () => {
  const params = new URLSearchParams({ page, perPage, ...(search ? { search } : {}) })
  const route = Endpoints.admin.chatbot + `/research-domains?${params}`
  const response = await getWithToken(route)
  return response.data.data // { domains, pagination }
}

export const createResearchDomain = (domain, journal_name = '') => async (dispatch) => {
  const route = Endpoints.admin.chatbot + '/research-domains'
  const response = await postWithToken(route, { domain, journal_name })
  return response.data.data
}

export const updateResearchDomain = (id, payload) => async () => {
  const route = Endpoints.admin.chatbot + `/research-domains/${id}`
  const response = await putWithToken(route, payload)
  return response.data.data
}

export const deleteResearchDomain = (id) => async () => {
  const route = Endpoints.admin.chatbot + `/research-domains/${id}`
  await deleteWithToken(route)
}

// ============= Journal Name Management =============

export const fetchAdminJournals = ({ page = 1, perPage = 20, search = '' } = {}) => async () => {
  const params = new URLSearchParams({ page, perPage, ...(search ? { search } : {}) })
  const route = Endpoints.admin.chatbotJournals + `?${params}`
  const response = await getWithToken(route)
  return response.data.data // { journals, pagination }
}

export const createAdminJournal = (name) => async () => {
  const route = Endpoints.admin.chatbotJournals
  const response = await postWithToken(route, { name })
  return response.data.data
}

export const updateAdminJournal = (id, payload) => async () => {
  const route = Endpoints.admin.chatbotJournals + `/${id}`
  const response = await putWithToken(route, payload)
  return response.data.data
}

export const deleteAdminJournal = (id) => async () => {
  const route = Endpoints.admin.chatbotJournals + `/${id}`
  await deleteWithToken(route)
}

export const fetchAdminConversations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))

    const { filters, pagination } = getState().chatbot

    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }

    if (filters?.search) queryParams.search = filters.search
    if (filters?.mode) queryParams.mode = filters.mode
    if (filters?.userId) queryParams.userId = filters.userId

    const route = Endpoints.admin.chatbot + '/conversations'
    const response = await getWithToken(route, queryParams)
    dispatch(setConversations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchAdminConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: true }))

    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}`
    const response = await getWithToken(route)
    dispatch(setCurrentConversation(response.data.data))
    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: false }))
  }
}

export const deleteAdminConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))

    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}`
    await deleteWithToken(route)
    dispatch(removeConversation(conversationId))
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchAdminConversationMessages = ({ conversationId, page = 1, perPage = 50, prepend = false }) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isMessagesLoading', value: true }))

    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}/messages`
    const queryParams = { page, perPage }
    const response = await getWithToken(route, queryParams)

    const messages = (response.data.data || []).reverse()
    const pagination = response.data.pagination || { page: 1, perPage: 50, isLastPage: false }

    if (prepend) {
      dispatch(actions.prependMessages(messages))
    } else {
      dispatch(setMessages(messages))
    }

    dispatch(setMessagePaginationForConversation({ conversationId, pagination }))
    return messages
  } finally {
    dispatch(setLoading({ key: 'isMessagesLoading', value: false }))
  }
}
