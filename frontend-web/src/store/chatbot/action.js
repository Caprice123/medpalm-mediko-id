import { actions } from '@store/chatbot/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'

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
    const route = Endpoints.api.chatbot + '/config'
    const response = await getWithToken(route)
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

    const route = Endpoints.api.chatbot + '/conversations'
    const response = await getWithToken(route, queryParams)
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

    const route = Endpoints.api.chatbot + `/conversations/${conversationId}`
    const response = await getWithToken(route)
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
    
    const route = Endpoints.api.chatbot + '/conversations'
    const response = await postWithToken(route, {
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
    
    const route = Endpoints.api.chatbot + `/conversations/${conversationId}`
    const response = await putWithToken(route, {
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
    
    const route = Endpoints.api.chatbot + `/conversations/${conversationId}`
    await deleteWithToken(route)
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
    
    const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages`
    const queryParams = { page, perPage }
    const response = await getWithToken(route, queryParams)

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

// Store active abort controller and user message for stream cancellation
let activeChatbotAbortController = null
let activeUserMessageContent = null

// Helper function to ensure token is valid and refreshed if needed
const ensureValidToken = async () => {
  const token = getToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  // Check if access token is expired
  const isTokenExpired = (isoString) => {
    const now = new Date()
    const targetDate = new Date(isoString)
    return targetDate < now
  }

  // If access token is expired, refresh it using axios
  if (isTokenExpired(token.accessTokenExpiresAt)) {
    return await refreshAccessToken()
  }

  return token.accessToken
}

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

    // Store user message content for potential stop action
    activeUserMessageContent = content

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

// Track if user stopped the stream
let userStoppedStream = false

export const stopChatbotStreaming = () => async (dispatch) => {
  try {
    console.log('⏹️ Frontend: User clicked stop button')

    // Set flag to stop receiving new chunks (but keep typing what we have)
    userStoppedStream = true

    // Abort the fetch - stops receiving new chunks from backend
    // Backend detects disconnect and saves partial message to database
    if (activeChatbotAbortController) {
      console.log('🔴 Frontend: Aborting fetch request')
      activeChatbotAbortController.abort()
      console.log('✅ Frontend: Fetch aborted')
    } else {
      console.log('⚠️ Frontend: No active abort controller found')
    }

    // Typing animation continues to display all already-received content
    // Messages stay visible with temporary IDs (temp-user-xxx, streaming-xxx)
    // When user refreshes page, they'll load the saved messages from database
    activeUserMessageContent = null

    // DON'T set loading to false here - let typing animation finish first
    // Loading will be set to false in typeNextCharacter when typing completes

    return null
  } catch (error) {
    console.error('Error stopping chatbot stream:', error)
    return null
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Streaming message handler - typing animation with backend pacing
const sendMessageStreaming = async (conversationId, content, mode, dispatch, optimisticUserId, abortController = null) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.chatbot + `/conversations/${conversationId}/send`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Reset user stopped flag
  userStoppedStream = false

  // Typing animation state
  let fullContent = '' // Complete content from backend chunks
  let displayedContent = '' // Content currently displayed with typing animation
  let sources = [] // Store sources - only show after streaming completes
  let showSources = false // Flag to control when to display sources
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null

  const TYPING_SPEED_MS = 10 // 10ms per character (backend delays based on chunk length × 10ms)

  // Add initial streaming message (no sources initially)
  dispatch(addMessage({
    id: streamingMessageId,
    senderType: 'ai',
    modeType: mode,
    content: '',
    sources: [],
    createdAt: messageCreatedAt
  }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // If user stopped stream and we've typed everything received, stop
    if (userStoppedStream && displayedContent.length >= fullContent.length) {
      console.log('✅ Finished typing all received content after stop - keeping messages visible')
      isTyping = false

      // Remove the streaming message and re-add with a non-streaming ID
      // This makes the stop button disappear while keeping the message visible
      dispatch(removeMessage(streamingMessageId))
      dispatch(addMessage({
        id: `partial-${Date.now()}`, // Use 'partial-' prefix instead of 'streaming-'
        senderType: 'ai',
        modeType: mode,
        content: displayedContent,
        sources: showSources ? sources : [], // Only show sources if streaming is done
        createdAt: messageCreatedAt
      }))

      // Backend is saving to database in background
      // When user refreshes, they'll see the saved messages from database

      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      userStoppedStream = false
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        dispatch(removeMessage(optimisticUserId))
        dispatch(removeMessage(streamingMessageId))

        if (finalData.userMessage) {
          dispatch(addMessage(finalData.userMessage))
        }
        if (finalData.aiMessage) {
          dispatch(addMessage(finalData.aiMessage))
        }

        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
        userStoppedStream = false
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessage({
      id: streamingMessageId,
      senderType: 'ai',
      modeType: mode,
      content: displayedContent,
      sources: showSources ? sources : [], // Only show sources after streaming completes
      createdAt: messageCreatedAt
    }))

    // Schedule next character
    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  // Add chunk to content and start typing if needed
  const addChunkToContent = (text) => {
    // If user stopped stream, don't add new chunks
    if (userStoppedStream) return

    // Filter out <think> tags
    let filteredText = text
    filteredText = filteredText.replace(/<think>[\s\S]*?<\/think>/gi, '')
    filteredText = filteredText.replace(/<\/?think>/gi, '')

    fullContent += filteredText

    // Start typing animation if not already running
    if (!isTyping) {
      typeNextCharacter()
    }
  }

  // Buffer for accumulating partial lines
  let buffer = ''

  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
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
        console.log('Stream ended')
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
              // Collect citation but don't show yet (wait until streaming completes)
              const newSource = {
                url: data.data.url,
                title: data.data.title
              }
              sources.push(newSource)
            } else if (data.type === 'done') {
              // Backend saved to database (full or partial)
              backendSavedMessage = true
              finalData = data.data
              showSources = true // Now we can show sources since streaming is complete

              console.log('✅ Backend saved messages:', data.data)
              console.log('✅ Citations ready to display:', sources.length)

              // If typing animation already caught up OR user stopped, finalize immediately
              if ((!isTyping && displayedContent.length >= fullContent.length) || userStoppedStream) {
                dispatch(removeMessage(optimisticUserId))
                dispatch(removeMessage(streamingMessageId))

                if (data.data.userMessage) {
                  dispatch(addMessage(data.data.userMessage))
                }
                if (data.data.aiMessage) {
                  dispatch(addMessage(data.data.aiMessage))
                }

                dispatch(setLoading({ key: 'isSendingMessage', value: false }))
                userStoppedStream = false
                return data.data
              }
              // Otherwise, let typing animation finish and it will finalize
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
    if (error.name === 'AbortError') {
      console.log('✅ Stream aborted by user - typing animation will finish showing all received content')
      // Keep typing animation going to finish displaying all received content
      // Backend is saving partial message in background
      // Typing animation will handle setting loading state to false when done
      // Don't clear messages, don't throw error
      return null
    } else {
      console.error('Streaming error:', error)
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      userStoppedStream = false
      throw error
    }
  }
}

export const switchMode = (mode) => async (dispatch) => {
  dispatch(setCurrentMode(mode))
}

export const submitFeedback = (messageId, feedbackType) => async (dispatch) => {
  try {
    const route = Endpoints.api.chatbot + `/conversations/${messageId}/feedback`
    await postWithToken(route, {
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

    const route = Endpoints.admin.chatbot + "/conversations"
    const response = await getWithToken(route, queryParams)
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
    
    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}`
    const response = await getWithToken(route)
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
    
    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}`
    await deleteWithToken(route)
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
    
    const route = Endpoints.admin.chatbot + `/conversations/${conversationId}/messages`
    const queryParams = { page, perPage }
    const response = await getWithToken(route, queryParams)

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
