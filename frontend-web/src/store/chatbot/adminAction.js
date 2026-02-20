import { actions } from '@store/chatbot/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, deleteWithToken } from '../../utils/requestUtils'

const {
  setLoading,
  setConversations,
  setCurrentConversation,
  setMessages,
  setPagination,
  setMessagePaginationForConversation,
  removeConversation,
} = actions

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
