import { actions } from '@store/chatbot/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, patchWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'

const {
  setLoading,
  setConversations,
  setCurrentConversation,
  setActiveConversationId,
  setMessages,
  addMessage,
  updateMessage,
  removeMessage,
  setMessagesForConversation,
  addMessageToConversation,
  updateMessageInConversation,
  removeMessageFromConversation,
  prependMessagesToConversation,
  setCurrentMode,
  setAvailableModes,
  setCosts,
  setUserInformation,
  setPagination,
  addConversation,
  updateConversation,
  removeConversation,
  setStreamingState,
  clearStreamingState,
} = actions

// ============= Configuration =============

export const fetchChatbotConfig = () => async (dispatch) => {
  try {
    const route = Endpoints.api.chatbot + '/config'
    const response = await getWithToken(route)
    const config = response.data.data

    dispatch(setAvailableModes(config.availableModes))
    dispatch(setCosts(config.costs))
    if (config.userInformation) {
      dispatch(setUserInformation(config.userInformation))
    }

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
      dispatch(prependMessagesToConversation({ conversationId, messages }))
    } else {
      // Replace messages (initial load page 1)
      dispatch(setMessagesForConversation({ conversationId, messages }))
    }

    dispatch(setPagination(pagination))
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isMessagesLoading', value: false }))
  }
}

// Store abort controllers per conversation (cannot be stored in Redux - not serializable)
const abortControllersByConversation = {}

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

export const sendMessage = (conversationId, content, mode) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isSendingMessage', value: true }))

    // Add user message immediately (optimistic UI) - conversation-specific
    const optimisticUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content: content,
      createdAt: new Date().toISOString()
    }
    dispatch(addMessageToConversation({ conversationId, message: optimisticUserMessage }))

    // Initialize streaming state for this conversation
    dispatch(setStreamingState({
      conversationId,
      isSending: true,
      isTyping: false,
      userStopped: false,
      userMessage: content,
      userMessageCreatedAt: new Date().toISOString(),
      streamingMessageId: null, // Will be set in sendMessageStreaming
      optimisticUserId: optimisticUserMessage.id,
      realMessageId: null,
      realUserMessageId: null,
      displayedContent: '',
      displayedLength: 0,
      mode
    }))

    // Create new AbortController for this conversation's stream
    abortControllersByConversation[conversationId] = new AbortController()

    // ALL modes now use streaming (normal, validated, research)
    return await sendMessageStreaming(
      conversationId,
      content,
      mode,
      dispatch,
      getState,
      optimisticUserMessage.id,
      abortControllersByConversation[conversationId]
    )
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log(`Chatbot stream was stopped by user for conversation ${conversationId}`)
      // stopChatbotStreaming already handled loading state and cleanup
      return null
    }
    handleApiError(err, dispatch)
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
  } finally {
    // Clean up abort controller for this conversation
    delete abortControllersByConversation[conversationId]
  }
}

export const stopChatbotStreaming = (conversationId) => async (dispatch, getState) => {
  try {
    console.log(`⏹️ Frontend: User clicked stop button for conversation ${conversationId}`)

    // Set flag to stop receiving new chunks and typing for this conversation
    dispatch(setStreamingState({
      conversationId,
      userStopped: true,
      isTyping: false
    }))

    // Abort the fetch for this specific conversation
    const controller = abortControllersByConversation[conversationId]
    if (controller) {
      console.log(`🔴 Frontend: Aborting fetch request for conversation ${conversationId}`)
      controller.abort()
      console.log('✅ Frontend: Fetch aborted')
    } else {
      console.log(`⚠️ Frontend: No active abort controller found for conversation ${conversationId}`)
    }

    // Get the streaming state from redux
    const state = getState()
    const streamingState = state.chatbot.streamingStateByConversation[conversationId]

    if (streamingState && streamingState.realMessageId && streamingState.displayedContent) {
      console.log(`📝 Finalizing truncated message: messageId=${streamingState.realMessageId}, content length=${streamingState.displayedContent.length}`)

      // Call finalize endpoint with the exact displayed content
      try {
        const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages/${streamingState.realMessageId}/finalize`
        const response = await postWithToken(route, {
          content: streamingState.displayedContent,
          isComplete: false // User stopped = truncated
        })
        console.log(streamingState)
        console.log('✅ Message finalized successfully on backend')

        // Remove temporary messages (streaming and optimistic user message)
        if (streamingState.streamingMessageId) {
            console.log("first")
          dispatch(removeMessageFromConversation({ conversationId, messageId: streamingState.streamingMessageId }))
        }
        if (streamingState.optimisticUserId) {
            console.log("second")
          dispatch(removeMessageFromConversation({ conversationId, messageId: streamingState.optimisticUserId }))
        }

        // Add the user message with real ID and content
        if (streamingState.userMessage && streamingState.realUserMessageId) {
            console.log("third")
          dispatch(addMessageToConversation({
            conversationId,
            message: {
              id: streamingState.realUserMessageId,
              senderType: 'user',
              content: streamingState.userMessage,
              createdAt: streamingState.userMessageCreatedAt,
            }
          }))
        }

        // Add the AI message with truncated content from backend response
        if (response.data && response.data.data) {
            console.log("fourth")
          dispatch(addMessageToConversation({
            conversationId,
            message: {
              id: response.data.data.id,
              senderType: 'ai',
              modeType: streamingState.mode,
              content: response.data.data.content,
              sources: [],
              createdAt: response.data.data.createdAt
            }
          }))

          // Update conversation's lastMessage in the conversations list
          const conversation = state.chatbot.conversations.find(c => c.id === conversationId)
          if (conversation) {
            const lastMessage = response.data.data.content.substring(0, 50)
            dispatch(updateConversation({
              ...conversation,
              lastMessage,
              updatedAt: new Date().toISOString()
            }))
          }
        }

      } catch (err) {
        console.error('❌ Error truncating message:', err)
      }
    } else {
      console.log('⚠️ No streaming state found, cannot truncate')
    }

    // Clean up streaming state
    dispatch(clearStreamingState(conversationId))
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))

    return null
  } catch (error) {
    console.error('Error stopping chatbot stream:', error)
    return null
  }
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// Streaming message handler - typing animation with backend pacing
const sendMessageStreaming = async (conversationId, content, mode, dispatch, getState, optimisticUserId, abortController = null) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.chatbot + `/conversations/${conversationId}/send`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Typing animation state
  let fullContent = '' // Complete content from backend chunks
  let displayedContent = '' // Content currently displayed with typing animation
  let sources = [] // Store sources - only show after streaming completes
  let showSources = false // Flag to control when to display sources
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null

  const TYPING_SPEED_MS = 1 // 3ms per character (~333 chars/sec) - fast but still smooth

  // Update streaming state with streamingMessageId
  dispatch(setStreamingState({
    conversationId,
    streamingMessageId
  }))

  // Add initial streaming message (no sources initially) - conversation-specific
  dispatch(addMessageToConversation({
    conversationId,
    message: {
      id: streamingMessageId,
      senderType: 'ai',
      modeType: mode,
      content: '',
      sources: [],
      createdAt: messageCreatedAt
    }
  }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // Check if user stopped stream from Redux state
    const state = getState()
    const streamingState = state.chatbot.streamingStateByConversation[conversationId]
    console.log(streamingState?.userStopped)

    if (streamingState?.userStopped) {
      console.log('⏹️ User stopped - stopping typing immediately')
      isTyping = false
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        // Call finalize endpoint with complete content
        const finalizeMessageAsync = async () => {
          try {
            const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages/${finalData.aiMessage.id}/finalize`
            await postWithToken(route, {
              content: fullContent, // Full content
              isComplete: true // Streaming completed naturally
            })
            console.log('✅ Message finalized as completed')

            // Remove temporary messages
            dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
            dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))

            // Add final messages
            if (finalData.userMessage) {
              dispatch(addMessageToConversation({ conversationId, message: finalData.userMessage }))
            }
            if (finalData.aiMessage) {
              dispatch(addMessageToConversation({
                conversationId,
                message: {
                  ...finalData.aiMessage,
                  content: fullContent // Use full content
                }
              }))
            }

            // Update conversation's lastMessage in the conversations list
            const state = getState()
            const conversation = state.chatbot.conversations.find(c => c.id === conversationId)
            if (conversation) {
              const lastMessage = fullContent.substring(0, 50)
              dispatch(updateConversation({
                ...conversation,
                lastMessage,
                updatedAt: new Date().toISOString()
              }))
            }

            dispatch(clearStreamingState(conversationId))
            dispatch(setLoading({ key: 'isSendingMessage', value: false }))
          } catch (error) {
            console.error('❌ Error finalizing completed message:', error)
          }
        }

        finalizeMessageAsync()
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    // Update message in this conversation - continues even if user switches away
    dispatch(updateMessageInConversation({
      conversationId,
      messageId: streamingMessageId,
      updates: {
        senderType: 'ai',
        modeType: mode,
        content: displayedContent,
        sources: showSources ? sources : [], // Only show sources after streaming completes
        createdAt: messageCreatedAt
      }
    }))

    // Update streaming state with current displayed length and content
    if (finalData && finalData.aiMessage && finalData.aiMessage.id) {
      dispatch(setStreamingState({
        conversationId,
        realMessageId: finalData.aiMessage.id,
        realUserMessageId: finalData.userMessage ? finalData.userMessage.id : null,
        displayedLength: displayedContent.length,
        displayedContent,
        isTyping: true
      }))
    } else {
      // Just update typing state
      dispatch(setStreamingState({
        conversationId,
        displayedLength: displayedContent.length,
        displayedContent,
        isTyping: true
      }))
    }

    // Schedule next character
    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  // Add chunk to content and start typing if needed
  const addChunkToContent = (text) => {
    // Check if user stopped stream from Redux state
    const state = getState()
    const streamingState = state.chatbot.streamingStateByConversation[conversationId]

    if (streamingState?.userStopped) return

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
            } else if (data.type == "started") {
                const { userMessage, aiMessage } = data.data
                dispatch(setStreamingState({
                    conversationId,
                    realUserMessageId: userMessage.id,
                    realMessageId: aiMessage.id,
                    streamingMessageCreatedAt: aiMessage.createdAt,
                }))
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

              // Store the real message IDs for potential truncation
              if (data.data.aiMessage && data.data.aiMessage.id) {
                dispatch(setStreamingState({
                  conversationId,
                  realMessageId: data.data.aiMessage.id,
                  realUserMessageId: data.data.userMessage ? data.data.userMessage.id : null,
                  displayedLength: displayedContent.length,
                  displayedContent
                }))
              }

              // If typing animation already caught up, finalize immediately
              if (displayedContent.length >= fullContent.length) {
                // Call finalize endpoint (async but don't wait)
                const finalizeImmediately = async () => {
                  try {
                    const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages/${data.data.aiMessage.id}/finalize`
                    await postWithToken(route, {
                      content: fullContent, // Full content
                      isComplete: true
                    })
                    console.log('✅ Message finalized immediately (typing caught up)')
                  } catch (error) {
                    console.error('❌ Error finalizing:', error)
                  }
                }
                finalizeImmediately()

                dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
                dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))

                if (data.data.userMessage) {
                  dispatch(addMessageToConversation({ conversationId, message: data.data.userMessage }))
                }
                if (data.data.aiMessage) {
                  dispatch(addMessageToConversation({
                    conversationId,
                    message: {
                      ...data.data.aiMessage,
                      content: fullContent // Use full content
                    }
                  }))
                }

                dispatch(clearStreamingState(conversationId))
                dispatch(setLoading({ key: 'isSendingMessage', value: false }))
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
      console.log('✅ Stream aborted by user')
      // stopChatbotStreaming already handled cleanup
      return null
    } else {
      console.error('Streaming error:', error)
      dispatch(clearStreamingState(conversationId))
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
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
