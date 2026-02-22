import { actions } from '@store/chatbot/reducer'
import { actions as commonActions } from '@store/common/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'
import { setTimeout as setWorkerTimeout, clearTimeout as clearWorkerTimeout } from 'worker-timers'

const {
  setLoading,
  setConversations,
  appendConversations,
  setCurrentConversation,
  setMessages,
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
  setMessagePaginationForConversation,
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
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// ============= User Endpoints =============

export const fetchConversations = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isConversationsLoading', value: true }))

    const state = getState().chatbot
    const currentPage = state.pagination.page
    const currentPerPage = state.pagination.perPage
    const { filters } = state

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
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const loadMoreConversations = () => async (dispatch, getState) => {
  const state = getState().chatbot
  console.log(state)
  if (state.pagination.isLastPage || state.loading.isLoadingMoreConversations) return

  try {
    dispatch(setLoading({ key: 'isLoadingMoreConversations', value: true }))

    const { filters, pagination } = state
    const nextPage = pagination.page + 1

    const queryParams = {
      page: nextPage,
      perPage: pagination.perPage
    }

    if (filters?.search) queryParams.search = filters.search
    if (filters?.mode) queryParams.mode = filters.mode

    const route = Endpoints.api.chatbot + '/conversations'
    const response = await getWithToken(route, queryParams)

    dispatch(appendConversations(response.data.data || []))
    dispatch(setPagination(response.data.pagination || { page: nextPage, perPage: pagination.perPage, isLastPage: true }))
  } finally {
    dispatch(setLoading({ key: 'isLoadingMoreConversations', value: false }))
  }
}

export const fetchConversation = (conversationId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCurrentConversationLoading', value: true }))

    const route = Endpoints.api.chatbot + `/conversations/${conversationId}`
    const response = await getWithToken(route)
    dispatch(setCurrentConversation(response.data.data))
    return response.data.data
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
  } finally {
    dispatch(setLoading({ key: 'isConversationsLoading', value: false }))
  }
}

export const fetchMessages = ({ conversationId, perPage = 10, prepend = false }) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isMessagesLoading', value: true }))

    const currentPagination = getState().chatbot.messagePaginationByConversation[conversationId]
    const page = prepend ? (currentPagination?.page ?? 1) + 1 : 1

    const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages`
    const response = await getWithToken(route, { page, perPage })

    // Backend returns DESC (newest first), so reverse it to show oldest→newest
    const messages = (response.data.data || []).reverse()
    const pagination = response.data.pagination || { page, perPage, isLastPage: false }

    if (prepend) {
      dispatch(prependMessagesToConversation({ conversationId, messages }))
    } else {
      dispatch(setMessagesForConversation({ conversationId, messages }))
    }

    dispatch(setMessagePaginationForConversation({ conversationId, pagination }))
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
    // Dispatch error to common reducer
    dispatch(commonActions.setError({ message: err.message || 'Terjadi kesalahan saat streaming pesan' }))
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
        const response = await dispatch(finalizeMessage(
          conversationId,
          streamingState.realMessageId,
          streamingState.displayedContent,
          false // User stopped = truncated
        ))

        // Remove temporary messages (streaming and optimistic user message)
        if (streamingState.streamingMessageId) {
          dispatch(removeMessageFromConversation({ conversationId, messageId: streamingState.streamingMessageId }))
        }
        if (streamingState.optimisticUserId) {
          dispatch(removeMessageFromConversation({ conversationId, messageId: streamingState.optimisticUserId }))
        }

        // Add the user message with real ID and content
        if (streamingState.userMessage && streamingState.realUserMessageId) {
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
        if (response.data) {
          dispatch(addMessageToConversation({
            conversationId,
            message: {
              id: response.data.id,
              senderType: 'ai',
              modeType: streamingState.mode,
              content: response.data.content,
              sources: response.data.sources || [],
              createdAt: response.data.createdAt
            }
          }))

          // Update conversation's lastMessage in the conversations list
          const conversation = state.chatbot.conversations.find(c => c.uniqueId === conversationId)
          if (conversation) {
            const lastMessage = response.data.content.substring(0, 50)
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

export const finalizeMessage = (conversationId, messageId, content, isComplete) => async () => {
  console.log(`📝 Finalizing message ${messageId} as ${isComplete ? 'completed' : 'truncated'}`)
  const route = Endpoints.api.chatbot + `/conversations/${conversationId}/messages/${messageId}/finalize`
  const response = await postWithToken(route, { content, isComplete })
  console.log('✅ Message finalized successfully')
  return response.data
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
  let finalized = false

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

  // Replaces optimistic/streaming placeholders with the finalized real messages
  const applyFinalizedMessage = ({ userMessage, aiMessage, content: finalContent, sources: finalSources, status }) => {
    dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
    dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))
    if (userMessage) {
      dispatch(addMessageToConversation({ conversationId, message: userMessage }))
    }
    if (aiMessage) {
      dispatch(addMessageToConversation({
        conversationId,
        message: {
          ...aiMessage,
          content: finalContent,
          sources: finalSources || [],
          ...(status && { status })
        }
      }))
    }
    dispatch(clearStreamingState(conversationId))
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
  }

  // Calls the finalize API then swaps in the real messages — used by both the
  // typing-complete path and the 'done' event path
  const runFinalize = async () => {
    try {
      const response = await dispatch(finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, true))
      applyFinalizedMessage({
        userMessage: finalData.userMessage,
        aiMessage: finalData.aiMessage,
        content: fullContent,
        sources: response.data?.sources || sources
      })
    } catch (error) {
      console.error('❌ Error finalizing completed message:', error)
      dispatch(clearStreamingState(conversationId))
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    }
  }

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

      if (backendSavedMessage && finalData && !finalized) {
        finalized = true
        runFinalize()
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

    // Schedule next character using worker-timers to prevent tab throttling
    setWorkerTimeout(typeNextCharacter, TYPING_SPEED_MS)
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
      const errorBody = await response.json().catch(() => ({}))
      dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
      dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))
      dispatch(clearStreamingState(conversationId))
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      dispatch(commonActions.setError(errorBody?.error || 'Terjadi kesalahan pada sistem'))
      return
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
          let data
          try {
            data = JSON.parse(line.slice(6))
          } catch (e) {
            console.error('❌ Error parsing SSE data:', e, line)
            continue
          }

          if (data.type === 'chunk') {
            // Check if first chunk contains userQuota and update credit balance
            if (data.data.userQuota && data.data.userQuota.balance !== undefined) {
              dispatch(pricingActions.updateCreditBalance(data.data.userQuota.balance))
              console.log('💎 Credit balance updated:', data.data.userQuota.balance)
            }
            addChunkToContent(data.data.content)
          } else if (data.type === 'started') {
            const { userMessage, aiMessage } = data.data
            dispatch(setStreamingState({
              conversationId,
              realUserMessageId: userMessage.id,
              realMessageId: aiMessage.id,
              streamingMessageCreatedAt: aiMessage.createdAt,
            }))
            finalData = data.data
          } else if (data.type === 'citation') {
            sources.push({ url: data.data.url, title: data.data.title })
          } else if (data.type === 'done') {
            backendSavedMessage = true
            finalData = data.data
            showSources = true

            if (data.data.sources && data.data.sources.length > 0) {
              sources.length = 0
              sources.push(...data.data.sources)
            }

            console.log('✅ Backend saved messages:', data.data)
            console.log('✅ Filtered citations ready to display:', sources.length)

            if (data.data.aiMessage && data.data.aiMessage.id) {
              dispatch(setStreamingState({
                conversationId,
                realMessageId: data.data.aiMessage.id,
                realUserMessageId: data.data.userMessage ? data.data.userMessage.id : null,
                displayedLength: displayedContent.length,
                displayedContent
              }))
            }

            if (!isTyping && displayedContent.length >= fullContent.length && !finalized) {
              finalized = true
              runFinalize()
              return data.data
            }
          } else if (data.type === 'error') {
            dispatch(commonActions.setError(data.error))
            if (finalData?.aiMessage) {
              try {
                const response = await dispatch(finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, false))
                applyFinalizedMessage({ userMessage: finalData.userMessage, aiMessage: finalData.aiMessage, content: '', sources: response.data?.sources || [], status: 'error' })
              } catch (saveError) {
                console.error('❌ Failed to finalize on error event:', saveError)
                dispatch(clearStreamingState(conversationId))
                dispatch(setLoading({ key: 'isSendingMessage', value: false }))
              }
            } else {
              dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
              dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))
              dispatch(clearStreamingState(conversationId))
              dispatch(setLoading({ key: 'isSendingMessage', value: false }))
            }
            return null
          }
        }
      }
    }

    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
  } catch (error){
    if (error.name === 'AbortError') {
      console.log('✅ Stream aborted by user')
      // stopChatbotStreaming already handled cleanup
      return null
    } else {
      console.error('❌ Streaming error:', error)

      if (finalData?.aiMessage) {
        // DB records were created — always finalize to avoid stuck 'streaming' status
        try {
          console.log(`💾 Finalizing message on error: ${fullContent.length} characters`)
          await dispatch(finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, false))
          applyFinalizedMessage({
            userMessage: finalData.userMessage,
            aiMessage: finalData.aiMessage,
            content: '',
            sources: [],
            status: 'error'
          })
          console.log('✅ Message finalized on error')
        } catch (saveError) {
          console.error('❌ Failed to finalize message on error:', saveError)
          dispatch(clearStreamingState(conversationId))
          dispatch(setLoading({ key: 'isSendingMessage', value: false }))
        }
      } else {
        dispatch(removeMessageFromConversation({ conversationId, messageId: optimisticUserId }))
        dispatch(removeMessageFromConversation({ conversationId, messageId: streamingMessageId }))
        dispatch(clearStreamingState(conversationId))
        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      }

      dispatch(commonActions.setError({ message: error.message || 'Terjadi kesalahan saat streaming pesan' }))
      return null
    }
  }
}

export const switchMode = (mode) => async (dispatch) => {
  dispatch(setCurrentMode(mode))
}

export const submitFeedback = (messageId, feedbackType) => async () => {
  try {
    const route = Endpoints.api.chatbot + `/conversations/${messageId}/feedback`
    await postWithToken(route, {
      feedbackType
    })
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

