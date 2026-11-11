import Endpoints from '@config/endpoint'
import { captureException } from '@config/sentry'
import { actions as commonActions } from '@store/common/reducer'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../../utils/requestUtils'
import { actions } from './reducer'
import { streamMessage } from './streaming'

const base = Endpoints.api.chatbotV2

const MESSAGES_PER_PAGE = 10

// AbortControllers are not serializable, so they live here rather than in Redux.
// Keyed by conversation: stopping one answer must not abort another thread's.
const abortControllers = {}

// ============= Configuration & settings =============

// One request for everything the chat shell needs before it can render.
export const bootstrapChatbot = () => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isBootstrapping', value: true }))

    const response = await getWithToken(`${base}/bootstrap`)
    const { config, settings } = response.data.data

    dispatch(actions.setConfig(config))
    dispatch(actions.setUserSettings(settings))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isBootstrapping', value: false }))
  }
}

export const updateUserChatbotSettings = (settings) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isUpdatingSettings', value: true }))

    const response = await putWithToken(`${base}/settings`, settings)
    dispatch(actions.setUserSettings(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isUpdatingSettings', value: false }))
  }
}

// The domain and journal pickers page and search as the user types, and feed a
// modal rather than the page, so they return their result instead of storing it.
export const fetchChatbotDomains = ({ page = 1, perPage = 12, search = '' } = {}) => async () => {
  const response = await getWithToken(`${base}/domains`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

export const fetchChatbotJournals = ({ page = 1, perPage = 20, search = '' } = {}) => async () => {
  const response = await getWithToken(`${base}/journals`, { page, perPage, ...(search ? { search } : {}) })
  return response.data.data
}

// Live lookup against the journal index itself, so a user only picks journals
// that actually resolve. An empty query browses the top journals.
export const searchChatbotJournals = ({ query = '', page = 1, perPage = 10 } = {}) => async () => {
  const response = await getWithToken(`${base}/journals/search`, { q: query.trim(), page, perPage })
  return response.data
}

// ============= Conversations =============

// Fetches whichever page the reducer currently points at. Callers reset or
// advance `pagination.page` first; this thunk never decides the page itself.
export const fetchConversations = ({ append = false } = {}) => async (dispatch, getState) => {
  const loadingKey = append ? 'isLoadingMoreConversations' : 'isConversationsLoading'

  try {
    dispatch(actions.setLoading({ key: loadingKey, value: true }))

    const { pagination, filters } = getState().chatbotV2
    const response = await getWithToken(`${base}/conversations`, {
      page: pagination.page,
      perPage: pagination.perPage,
      ...(filters.search ? { search: filters.search } : {}),
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

export const loadMoreConversations = () => (dispatch, getState) => {
  const { pagination, loading } = getState().chatbotV2
  if (pagination.isLastPage || loading.isLoadingMoreConversations) return

  dispatch(actions.setPagination({ page: pagination.page + 1 }))
  return dispatch(fetchConversations({ append: true }))
}

export const reloadConversations = () => (dispatch) => {
  dispatch(actions.setPagination({ page: 1 }))
  return dispatch(fetchConversations())
}

export const fetchConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isCurrentConversationLoading', value: true }))

    const response = await getWithToken(`${base}/conversations/${conversationId}`)
    dispatch(actions.setCurrentConversation(response.data.data))

    return response.data.data
  } finally {
    dispatch(actions.setLoading({ key: 'isCurrentConversationLoading', value: false }))
  }
}

export const createConversation = (topic, mode = 'normal') => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isCreatingConversation', value: true }))

    const response = await postWithToken(`${base}/conversations`, { topic, initialMode: mode })
    const conversation = response.data.data

    dispatch(actions.addConversation(conversation))
    return conversation
  } finally {
    dispatch(actions.setLoading({ key: 'isCreatingConversation', value: false }))
  }
}

export const renameConversation = (conversationId, topic) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isRenamingConversation', value: true }))

    const response = await putWithToken(`${base}/conversations/${conversationId}`, { topic })
    const conversation = response.data.data

    dispatch(actions.updateConversation(conversation))
    dispatch(actions.setCurrentConversation(conversation))

    return conversation
  } finally {
    dispatch(actions.setLoading({ key: 'isRenamingConversation', value: false }))
  }
}

export const deleteConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(actions.setLoading({ key: 'isDeletingConversation', value: true }))

    await deleteWithToken(`${base}/conversations/${conversationId}`)
    dispatch(actions.removeConversation(conversationId))
  } finally {
    dispatch(actions.setLoading({ key: 'isDeletingConversation', value: false }))
  }
}

// ============= Messages =============

// The backend returns newest-first so that page 1 is the tail of the thread;
// each page is reversed for display and older pages are prepended above.
export const fetchMessages = (conversationId, { prepend = false } = {}) => async (dispatch, getState) => {
  try {
    dispatch(actions.setLoading({ key: 'isMessagesLoading', value: true }))

    const pagination = getState().chatbotV2.messagePaginationByConversation[conversationId]
    const page = pagination?.page ?? 1

    const response = await getWithToken(`${base}/conversations/${conversationId}/messages`, {
      page,
      perPage: pagination?.perPage ?? MESSAGES_PER_PAGE,
    })

    const messages = (response.data.data || []).slice().reverse()

    dispatch(prepend
      ? actions.prependMessages({ conversationId, messages })
      : actions.setMessages({ conversationId, messages }))

    dispatch(actions.setMessagePagination({
      conversationId,
      pagination: response.data.pagination || { page, perPage: MESSAGES_PER_PAGE, isLastPage: true },
    }))
  } finally {
    dispatch(actions.setLoading({ key: 'isMessagesLoading', value: false }))
  }
}

export const openConversationMessages = (conversationId) => (dispatch) => {
  dispatch(actions.setMessagePagination({
    conversationId,
    pagination: { page: 1, perPage: MESSAGES_PER_PAGE, isLastPage: false },
  }))
  return dispatch(fetchMessages(conversationId))
}

export const loadOlderMessages = (conversationId) => (dispatch, getState) => {
  const { messagePaginationByConversation, loading } = getState().chatbotV2
  const pagination = messagePaginationByConversation[conversationId]

  if (!pagination || pagination.isLastPage || loading.isMessagesLoading) return

  dispatch(actions.setMessagePagination({
    conversationId,
    pagination: { page: pagination.page + 1 },
  }))
  return dispatch(fetchMessages(conversationId, { prepend: true }))
}

// Moves a message off status 'streaming' — with the whole text when the stream
// played out, or with exactly what was displayed when the user stopped it.
export const finalizeMessage = (conversationId, messageId, content, isComplete) => async () => {
  const response = await postWithToken(
    `${base}/conversations/${conversationId}/messages/${messageId}/finalize`,
    { content, isComplete }
  )
  return response.data
}

export const sendMessage = (conversationId, content, mode) => async (dispatch, getState) => {
  try {
    dispatch(actions.setLoading({ key: 'isSendingMessage', value: true }))

    // Shown immediately, then swapped for the persisted row once the backend
    // reports the real id.
    const optimisticUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content,
      createdAt: new Date().toISOString(),
    }
    dispatch(actions.addMessage({ conversationId, message: optimisticUserMessage }))

    dispatch(actions.setStreamingState({
      conversationId,
      isSending: true,
      isTyping: false,
      userStopped: false,
      userMessage: content,
      userMessageCreatedAt: optimisticUserMessage.createdAt,
      optimisticUserId: optimisticUserMessage.id,
      mode,
    }))

    abortControllers[conversationId] = new AbortController()

    return await streamMessage({
      conversationId,
      content,
      mode,
      dispatch,
      getState,
      optimisticUserId: optimisticUserMessage.id,
      abortController: abortControllers[conversationId],
      finalizeMessage,
    })
  } catch (error) {
    if (error.name === 'AbortError') return null

    captureException(error, { feature: 'chatbot_v2', conversationId, phase: 'send' })
    dispatch(commonActions.setError({ message: error.message || 'Terjadi kesalahan saat mengirim pesan' }))
    dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
    return null
  } finally {
    delete abortControllers[conversationId]
  }
}

// Stops an answer mid-flight and keeps exactly the text the student already saw.
export const stopStreaming = (conversationId) => async (dispatch, getState) => {
  // Set before aborting: the typing loop reads this flag to stop revealing text.
  dispatch(actions.setStreamingState({ conversationId, userStopped: true, isTyping: false }))

  abortControllers[conversationId]?.abort()

  const state = getState().chatbotV2
  const streaming = state.streamingStateByConversation[conversationId]

  // Nothing was persisted yet, so there is nothing to truncate — just clear up.
  if (!streaming?.realMessageId || !streaming.displayedContent) {
    dispatch(actions.clearStreamingState(conversationId))
    dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
    return null
  }

  try {
    const response = await dispatch(finalizeMessage(
      conversationId,
      streaming.realMessageId,
      streaming.displayedContent,
      false
    ))

    dispatch(actions.removeMessage({ conversationId, messageId: streaming.streamingMessageId }))
    dispatch(actions.removeMessage({ conversationId, messageId: streaming.optimisticUserId }))

    if (streaming.userMessage && streaming.realUserMessageId) {
      dispatch(actions.addMessage({
        conversationId,
        message: {
          id: streaming.realUserMessageId,
          senderType: 'user',
          content: streaming.userMessage,
          createdAt: streaming.userMessageCreatedAt,
        },
      }))
    }

    if (response.data) {
      dispatch(actions.addMessage({
        conversationId,
        message: {
          id: response.data.id,
          senderType: 'ai',
          modeType: streaming.mode,
          content: response.data.content,
          status: response.data.status,
          sources: response.data.sources || [],
          createdAt: response.data.createdAt,
        },
      }))

      dispatch(actions.updateConversation({
        uniqueId: conversationId,
        lastMessage: response.data.content.substring(0, 50),
        updatedAt: new Date().toISOString(),
      }))
    }
  } catch (error) {
    captureException(error, { feature: 'chatbot_v2', conversationId, phase: 'stop' })
  } finally {
    dispatch(actions.clearStreamingState(conversationId))
    dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
  }

  return null
}

export const switchMode = (mode) => (dispatch) => {
  dispatch(actions.setCurrentMode(mode))
}

// `isHelpful` is what the backend stores. V1 posted `{ feedbackType }` to a
// conversation path no route matched, so neither the body nor the URL was right
// and feedback never saved.
//
// The message is patched locally too, so the thumb stays pressed without
// refetching the thread — and still reads correctly after a reload, since the
// V2 serializer now returns `myFeedback`.
export const submitFeedback = ({ conversationId, messageId, isHelpful, feedback = null }) => async (dispatch) => {
  await postWithToken(`${base}/messages/${messageId}/feedback`, { isHelpful, feedback })

  dispatch(actions.updateMessage({
    conversationId,
    messageId,
    updates: { myFeedback: { isHelpful, feedback } },
  }))
}
