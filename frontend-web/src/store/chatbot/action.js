import { actions } from '@store/chatbot/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'

const {
  setLoading,
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  setCurrentMode,
  setAvailableModes,
  setCosts,
  setPagination,
  addConversation,
  updateConversation,
  removeConversation,
} = actions

// ============= Configuration =============

export const fetchChatbotConfig = () => async (dispatch) => {
  try {
    const response = await getWithToken(Endpoints.chatbot.config)
    const config = response.data.data

    dispatch(setAvailableModes(config.availableModes))
    dispatch(setCosts(config.costs))

    return config
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// ============= User Endpoints =============

export const fetchConversations = (filters, page, perPage) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))

    // If no parameters provided, get from state
    const state = getState().chatbot
    const currentPage = page || state.pagination.page
    const currentPerPage = perPage || state.pagination.perPage

    const queryParams = {
      page: currentPage,
      perPage: currentPerPage
    }

    if (filters?.search) queryParams.search = filters.search
    if (filters?.mode) queryParams.mode = filters.mode

    const response = await getWithToken(Endpoints.chatbot.conversations, queryParams)
    dispatch(setConversations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: true }))

    const response = await getWithToken(Endpoints.chatbot.conversation(conversationId))
    dispatch(setCurrentConversation(response.data.data))
    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: false }))
  }
}

export const createConversation = (topic, mode = 'normal') => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))
    

    const response = await postWithToken(Endpoints.chatbot.conversations, {
      topic,
      initialMode: mode
    })

    const conversation = response.data.data
    dispatch(addConversation(conversation))
    return conversation
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const renameConversation = (conversationId, topic) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))
    

    const response = await putWithToken(Endpoints.chatbot.conversation(conversationId), {
      topic
    })

    const conversation = response.data.data
    dispatch(updateConversation(conversation))
    dispatch(setCurrentConversation(conversation))
    return conversation
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const deleteConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))
    

    await deleteWithToken(Endpoints.chatbot.conversation(conversationId))
    dispatch(removeConversation(conversationId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchMessages = ({ conversationId, page = 1, perPage = 50, prepend = false }) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isMessagesLoading', value: true }))
    

    const queryParams = { page, perPage }
    const response = await getWithToken(Endpoints.chatbot.messages(conversationId), queryParams)

    // Backend returns DESC (newest first), so reverse it to show oldest→newest
    const messages = (response.data.data || []).reverse()
    const pagination = response.data.pagination || { page: 1, perPage: 50, isLastPage: false }

    if (prepend) {
      // Prepend older messages at the beginning (for page 2, 3, etc.)
      dispatch(actions.prependMessages(messages))
    } else {
      // Replace messages (initial load page 1)
      dispatch(setMessages(messages))
    }

    dispatch(setPagination(pagination))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isMessagesLoading', value: false }))
  }
}

// Store active abort controller for stream cancellation
let activeChatbotAbortController = null

export const sendMessage = (conversationId, content, mode) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSendingMessage', value: true }))


    // Add user message immediately (optimistic UI)
    const optimisticUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content: content,
      createdAt: new Date().toISOString()
    }
    dispatch(addMessage(optimisticUserMessage))

    // Create new AbortController for this stream
    activeChatbotAbortController = new AbortController()

    // ALL modes now use streaming (normal, validated, research)
    return await sendMessageStreaming(conversationId, content, mode, dispatch, optimisticUserMessage.id, activeChatbotAbortController)
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Chatbot stream was stopped by user')
      return null
    }
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    activeChatbotAbortController = null
  }
}

export const stopChatbotStreaming = (conversationId, partialContent, mode) => async (dispatch) => {
  try {
    // Abort the active stream
    if (activeChatbotAbortController) {
      activeChatbotAbortController.abort()
    }

    // Save partial content to database
    if (partialContent && partialContent.trim()) {
      const token = getToken()
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      const url = `${API_BASE_URL}/api/v1/conversations/${conversationId}/save-partial-message`

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token.accessToken}`
        },
        body: JSON.stringify({ content: partialContent, modeType: mode })
      })

      if (response.ok) {
        const result = await response.json()
        console.log('Partial chatbot message saved to database')
        return result.data // Return the saved message with real ID
      }
    }
    return null
  } catch (error) {
    console.error('Error stopping chatbot stream:', error)
    return null
  }
}

// Streaming message handler - character-by-character typing (preserves markdown)
const sendMessageStreaming = async (conversationId, content, mode, dispatch, optimisticUserId, abortController = null) => {
  const token = getToken()
  const url = `${Endpoints.chatbot.send(conversationId)}`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Character-by-character streaming state
  let fullContent = '' // Complete content from backend
  let displayedContent = '' // Content currently displayed
  let isTyping = false
  let streamEnded = false
  let finalData = null
  let sources = [] // Store sources as they arrive

  // Typing speed (milliseconds per character) - faster feels more natural
  const TYPING_SPEED = 1

  // Add initial streaming message
  dispatch(addMessage({
    id: streamingMessageId,
    senderType: 'ai',
    modeType: mode,
    content: '',
    sources: [],
    createdAt: messageCreatedAt
  }))

  // Character-by-character display function
  const displayNextCharacter = () => {
    // If no more characters to display
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If stream ended and all characters displayed, finalize
      if (streamEnded && finalData) {
        console.log('✅ All characters displayed, finalizing messages')
        dispatch(removeMessage(optimisticUserId))
        dispatch(removeMessage(streamingMessageId))

        if (finalData.userMessage) {
          dispatch(addMessage(finalData.userMessage))
        }
        if (finalData.aiMessage) {
          dispatch(addMessage(finalData.aiMessage))
        }

        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      }
      return
    }

    isTyping = true
    // Add next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessage({
      id: streamingMessageId,
      senderType: 'ai',
      modeType: mode,
      content: displayedContent,
      sources: sources, // Include sources as they arrive
      createdAt: messageCreatedAt
    }))

    // Schedule next character
    setTimeout(displayNextCharacter, TYPING_SPEED)
  }

  // Add chunk to full content and start typing if not already typing
  const addChunkToContent = (text) => {
    // Filter out <think> tags and their content
    let filteredText = text
    // Remove <think>...</think> blocks
    filteredText = filteredText.replace(/<think>[\s\S]*?<\/think>/gi, '')
    // Remove any remaining <think> or </think> tags
    filteredText = filteredText.replace(/<\/?think>/gi, '')

    fullContent += filteredText

    if (!isTyping) {
      displayNextCharacter()
    }
  }

  // Buffer for accumulating partial lines
  let buffer = ''

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify({ message: content, mode }),
      signal: abortController?.signal
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()

      if (done) {
        break
      }

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          try {
            const data = JSON.parse(line.slice(6))

            if (data.type === 'chunk') {
              addChunkToContent(data.data.content)
            } else if (data.type === 'citation') {
              // Add citation to sources array
              const newSource = {
                url: data.data.url,
                title: data.data.title
              }
              sources.push(newSource)
              console.log(`📚 Citation [${sources.length}] received:`, data.data.url)
              console.log('📚 Total sources now:', sources.length)
            } else if (data.type === 'done') {
              streamEnded = true
              finalData = data.data

              // If not typing and all displayed, finalize immediately
              if (!isTyping && displayedContent.length >= fullContent.length) {
                dispatch(removeMessage(optimisticUserId))
                dispatch(removeMessage(streamingMessageId))

                if (data.data.userMessage) {
                  dispatch(addMessage(data.data.userMessage))
                }
                if (data.data.aiMessage) {
                  dispatch(addMessage(data.data.aiMessage))
                }

                dispatch(setLoading({ key: 'isSendingMessage', value: false }))
                return data.data
              }
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch (e) {
            console.error('❌ Error parsing SSE data:', e, line)
          }
        }
      }
    }

    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
  } catch (error) {
    console.error('Streaming error:', error)
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    throw error
  }
}

export const switchMode = (mode) => async (dispatch) => {
  dispatch(setCurrentMode(mode))
}

export const submitFeedback = (messageId, feedbackType) => async (dispatch) => {
  try {
    await postWithToken(Endpoints.chatbot.feedback(messageId), {
      feedbackType
    })
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// ============= Admin Endpoints =============

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

    const response = await getWithToken(Endpoints.chatbot.admin.conversations, queryParams)
    dispatch(setConversations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: 1, perPage: 20, isLastPage: false }))
    console.log(response.data.pagination)
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchAdminConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: true }))
    

    const response = await getWithToken(Endpoints.chatbot.admin.conversation(conversationId))
    dispatch(setCurrentConversation(response.data.data))
    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: false }))
  }
}

export const deleteAdminConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))
    

    await deleteWithToken(Endpoints.chatbot.admin.conversation(conversationId))
    dispatch(removeConversation(conversationId))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchAdminConversationMessages = ({ conversationId, page = 1, perPage = 50, prepend = false }) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isMessagesLoading', value: true }))
    

    const queryParams = { page, perPage }
    const response = await getWithToken(Endpoints.chatbot.admin.messages(conversationId), queryParams)

    // Backend returns DESC (newest first), so reverse it to show oldest→newest
    const messages = (response.data.data || []).reverse()
    const pagination = response.data.pagination || { page: 1, perPage: 50, isLastPage: false }

    if (prepend) {
      // Prepend older messages at the beginning (for page 2, 3, etc.)
      dispatch(actions.prependMessages(messages))
    } else {
      // Replace messages (initial load page 1)
      dispatch(setMessages(messages))
    }

    dispatch(setPagination(pagination))
    return messages
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isMessagesLoading', value: false }))
  }
}
