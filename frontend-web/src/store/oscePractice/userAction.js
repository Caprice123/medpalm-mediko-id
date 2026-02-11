import { actions } from '@store/oscePractice/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, patchWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'
import { checkMimeTypeSupport } from '@utils/testDeepgramConnection'
import { setTimeout } from 'worker-timers'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const {
  setLoading,
  setUserTopics,
  setUserSessions,
  setSessionDetail,
  setSessionMessages,
  setPhysicalExamMessages,
  setSessionObservations,
  setSessionDiagnoses,
  setSessionTherapies,
  setMessagesPagination,
  setPhysicalExamMessagesPagination,
  addMessage,
  addPhysicalExamMessage,
  updateMessage,
  updatePhysicalExamMessage,
  removeMessage,
  removePhysicalExamMessage,
  prependMessages,
  prependPhysicalExamMessages,
  updateSessionsPagination,
} = actions

// Fetch available topics for user
export const fetchUserOsceTopics = (params = {}) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingUserTopics', value: true }))

    const queryParams = new URLSearchParams()
    if (params.search) queryParams.append('search', params.search)
    if (params.topicTag) queryParams.append('topicTag', params.topicTag)
    if (params.batchTag) queryParams.append('batchTag', params.batchTag)
    if (params.page) queryParams.append('page', params.page)
    if (params.perPage) queryParams.append('perPage', params.perPage)

    const route = Endpoints.api.oscePractice + "/topics" + (queryParams.toString() ? `?${queryParams.toString()}` : '')
    const response = await getWithToken(route)

    const topics = response.data.data || []
    const pagination = response.data.pagination || {}

    dispatch(setUserTopics(topics))

    return { topics, pagination }
  } finally {
    dispatch(setLoading({ key: 'isLoadingUserTopics', value: false }))
  }
}

// Fetch user's session history
export const fetchUserOsceSessions = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: true }))

    const { sessionsPagination } = getState().oscePractice
    const params = {
      page: sessionsPagination.page,
      perPage: sessionsPagination.perPage
    }

    const route = Endpoints.api.oscePractice + "/sessions"
    const response = await getWithToken(route, params)

    const sessions = response.data.data || []
    const pagination = response.data.pagination || {}

    dispatch(setUserSessions(sessions))
    dispatch(updateSessionsPagination(pagination))

    return { sessions, pagination }
  } finally {
    dispatch(setLoading({ key: 'isLoadingUserSessions', value: false }))
  }
}

// Create a new OSCE practice session (no credit deduction)
export const createOsceSession = (topicId, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingSession', value: true }))

    const route = Endpoints.api.oscePractice + "/sessions"
    const response = await postWithToken(route, { topicId })

    if (onSuccess) onSuccess(response.data.data)
    return response.data.data
  }finally {
    dispatch(setLoading({ key: 'isCreatingSession', value: false }))
  }
}

// Start an existing OSCE practice session (deducts credits)
export const startOsceSession = (sessionId, sttProvider) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isStartingSession', value: true }))

    // Check supported MIME type
    const mimeTypeCheck = checkMimeTypeSupport()
    const supportedMimeType = mimeTypeCheck.mimeType

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/start`
    const response = await postWithToken(route, {
      sttProvider,
      supportedMimeType
    })

    return response.data
  }finally {
    dispatch(setLoading({ key: 'isStartingSession', value: false }))
  }
}

// Update OSCE session metadata (e.g., STT provider fallback)
export const updateSessionMetadata = (sessionId, metadata) => async (dispatch) => {
  try {
    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/metadata`
    const response = await patchWithToken(route, metadata)

    // Don't refetch - just update silently to avoid re-renders
    return response.data
  } catch (err) {
    console.error('Failed to update session metadata:', err)
    throw err
  }
}

// Fetch session detail by uniqueId
export const fetchSessionDetail = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionDetail', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}`
    const response = await getWithToken(route)

    const sessionDetail = response.data.data || null
    dispatch(setSessionDetail(sessionDetail))
    return sessionDetail
  }finally {
    dispatch(setLoading({ key: 'isLoadingSessionDetail', value: false }))
  }
}

// Fetch session messages (initial load - get latest messages)
export const fetchSessionMessages = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionMessages', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/messages`
    const response = await getWithToken(route)

    const { data, pagination } = response.data

    // Transform API data to frontend format
    const transformedMessages = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.senderType === 'user',
      createdAt: msg.createdAt,
      creditsUsed: msg.creditsUsed,
    }))

    dispatch(setSessionMessages(transformedMessages))
    dispatch(setMessagesPagination({
      hasMore: pagination.hasMore,
      nextCursor: pagination.nextCursor,
    }))
  }finally {
    dispatch(setLoading({ key: 'isLoadingSessionMessages', value: false }))
  }
}

// Load more messages (for infinite scroll - get older messages)
export const loadMoreMessages = (sessionId, cursor) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingMoreMessages', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/messages?cursor=${cursor}`
    const response = await getWithToken(route)

    const { data, pagination } = response.data

    // Transform API data to frontend format
    const transformedMessages = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.senderType === 'user',
      createdAt: msg.createdAt,
      creditsUsed: msg.creditsUsed,
    }))

    // Prepend older messages to the beginning
    dispatch(prependMessages({
      sessionId,
      messages: transformedMessages,
    }))

    dispatch(setMessagesPagination({
      hasMore: pagination.hasMore,
      nextCursor: pagination.nextCursor,
    }))

    return transformedMessages.length
  }finally {
    dispatch(setLoading({ key: 'isLoadingMoreMessages', value: false }))
  }
}

// Fetch session observations
export const fetchSessionObservations = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingSessionObservations', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/observations`
    const response = await getWithToken(route)

    const observations = response.data.data || []
    dispatch(setSessionObservations(observations))
    return observations
  }finally {
    dispatch(setLoading({ key: 'isLoadingSessionObservations', value: false }))
  }
}

// Save session observations
export const saveSessionObservations = (sessionId, observations, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingSessionObservations', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/observations`
    const response = await postWithToken(route, { observations })

    const savedObservations = response.data.data || []
    dispatch(setSessionObservations(savedObservations))

    if (onSuccess) onSuccess(response.data)
    return response.data
  }finally {
    dispatch(setLoading({ key: 'isSavingSessionObservations', value: false }))
  }
}

// Save session diagnoses
export const saveSessionDiagnoses = (sessionId, diagnosesData, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingSessionDiagnoses', value: true }))

    const route = Endpoints.api.osceDiagnoses(sessionId)
    const response = await putWithToken(route, diagnosesData)

    const savedDiagnoses = response.data.data || []
    dispatch(setSessionDiagnoses(savedDiagnoses))

    if (onSuccess) onSuccess(response.data)
    return response.data
  }finally {
    dispatch(setLoading({ key: 'isSavingSessionDiagnoses', value: false }))
  }
}

// Save session therapies
export const saveSessionTherapies = (sessionId, therapies, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingSessionTherapies', value: true }))

    const route = Endpoints.api.osceTherapies(sessionId)
    const response = await putWithToken(route, { therapies })

    const savedTherapies = response.data.data || []
    dispatch(setSessionTherapies(savedTherapies))

    if (onSuccess) onSuccess(response.data)
    return response.data
  }finally {
    dispatch(setLoading({ key: 'isSavingSessionTherapies', value: false }))
  }
}

// End OSCE session with evaluation
export const endOsceSession = (sessionId, data, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isEndingSession', value: true }))

    const route = Endpoints.api.osceEndSession(sessionId)
    const response = await postWithToken(route, data)

    if (onSuccess) onSuccess(response.data)
    return response.data
  }finally {
    dispatch(setLoading({ key: 'isEndingSession', value: false }))
  }
}

// ============= Message Streaming =============

// Store active abort controller for stream cancellation
let activeAbortController = null
let activePhysicalExamAbortController = null

// Track if user stopped the stream
let userStoppedStreamFlag = false
let physicalExamUserStoppedStreamFlag = false

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

// Send message with streaming
export const sendMessage = (sessionId, message) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSendingMessage', value: true }))

    // Add user message immediately (optimistic UI)
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      isUser: true,
      content: message,
      timestamp: new Date().toISOString()
    }
    dispatch(addMessage({ sessionId, message: tempUserMessage }))

    // Create new AbortController for this stream
    activeAbortController = new AbortController()
    console.log('🆕 Created new AbortController:', activeAbortController)

    // Use streaming for all messages
    await sendMessageStreaming(sessionId, message, dispatch, activeAbortController, tempUserMessage.id)
    console.log('✅ sendMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('OSCE stream was stopped by user')
      return
    }
    console.error('❌ sendMessage caught error:', err)
    // no need to handle anything because already handled in api.jsx
  } finally {
    console.log('🧹 sendMessage finally block - clearing activeAbortController')
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    activeAbortController = null
  }
}

// Stop streaming
export const stopStreaming = () => async (dispatch) => {
  try {
    console.log('⏹️ User clicked stop button')
    console.log('📋 Current activeAbortController:', activeAbortController)

    userStoppedStreamFlag = true

    // Abort the fetch connection to stop backend from generating more content
    if (activeAbortController) {
      console.log('🛑 Aborting active stream...')
      activeAbortController.abort()
      console.log('✅ Stream aborted - backend will save partial content')
    } else {
      console.warn('⚠️ No active abort controller found - stream might have already finished')
    }

    return null
  } catch (error) {
    console.error('Error stopping stream:', error)
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    dispatch(setLoading({ key: 'isAssistantTyping', value: false }))
    return null
  }
}

// Streaming message handler - typing animation with backend pacing
const sendMessageStreaming = async (sessionId, content, dispatch, abortController, optimisticUserId) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.osceMessages(sessionId)

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Reset user stopped flag
  userStoppedStreamFlag = false

  // Typing animation state
  let fullContent = '' // Complete content from backend chunks
  let displayedContent = '' // Content currently displayed with typing animation
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null

  const TYPING_SPEED_MS = 1 // 1ms per character (~1000 chars/sec) - fast but still smooth

  // Add initial streaming message and set assistant typing state
  dispatch(addMessage({
    sessionId,
    message: {
      id: streamingMessageId,
      isUser: false,
      content: '',
      timestamp: messageCreatedAt
    }
  }))
  dispatch(setLoading({ key: 'isAssistantTyping', value: true }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // If user stopped stream and we've typed everything received, stop
    if (userStoppedStreamFlag && displayedContent.length >= fullContent.length) {
      console.log('✅ Finished typing all received content after stop - keeping messages visible')
      isTyping = false

      // Remove the streaming message and re-add with a non-streaming ID
      dispatch(removeMessage({ sessionId, messageId: streamingMessageId }))
      dispatch(addMessage({
        sessionId,
        message: {
          id: `partial-${Date.now()}`,
          isUser: false,
          content: displayedContent,
          timestamp: messageCreatedAt
        }
      }))

      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      dispatch(setLoading({ key: 'isAssistantTyping', value: false }))
      userStoppedStreamFlag = false
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        dispatch(removeMessage({ sessionId, messageId: optimisticUserId }))
        dispatch(removeMessage({ sessionId, messageId: streamingMessageId }))

        if (finalData.userMessage) {
          dispatch(addMessage({
            sessionId,
            message: {
              id: finalData.userMessage.id,
              isUser: true,
              content: finalData.userMessage.content,
              timestamp: finalData.userMessage.createdAt
            }
          }))
        }
        if (finalData.aiMessage) {
          dispatch(addMessage({
            sessionId,
            message: {
              id: finalData.aiMessage.id,
              isUser: false,
              content: finalData.aiMessage.content,
              timestamp: finalData.aiMessage.createdAt,
              creditsUsed: finalData.aiMessage.creditsUsed
            }
          }))
        }

        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
        dispatch(setLoading({ key: 'isAssistantTyping', value: false }))
        userStoppedStreamFlag = false
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessage({
      sessionId,
      messageId: streamingMessageId,
      content: displayedContent
    }))

    // Schedule next character
    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  // Add chunk to content and start typing if needed
  const addChunkToContent = (text) => {
    // If user stopped stream, don't add new chunks
    if (userStoppedStreamFlag) return

    fullContent += text

    // Start typing animation if not already running
    if (!isTyping) {
      typeNextCharacter()
    }
  }

  let buffer = ''

  try {
    console.log('Streaming URL:', route)
    console.log('Sending message:', content)

    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ message: content }),
      signal: abortController?.signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error:', response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
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
              // Check if first chunk contains userQuota and update credit balance
              if (data.data?.userQuota && data.data.userQuota.balance !== undefined) {
                dispatch(pricingActions.updateCreditBalance(data.data.userQuota.balance))
                console.log('💎 Credit balance updated:', data.data.userQuota.balance)
              }

              // Only add chunk if user hasn't stopped the stream
              if (!userStoppedStreamFlag) {
                // Handle both formats: data.content (old) and data.data.content (new Skripsi-style)
                const chunkContent = data.data?.content || data.content
                addChunkToContent(chunkContent)
              } else {
                console.log('⏸️ Ignoring new chunk - user stopped stream')
              }
            } else if (data.type === 'done') {
              // Backend saved to database (full or partial)
              backendSavedMessage = true
              finalData = data.data
              // Don't finalize here - let the typing animation complete first
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError)
          }
        }
      }
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('✅ Stream aborted by user - typing animation will finish showing all received content')
      // Keep typing animation going to finish displaying all received content
      return null
    } else {
      console.error('Streaming error:', error)
      // Clean up on non-abort errors
      dispatch(removeMessage({ sessionId, messageId: optimisticUserId }))
      dispatch(removeMessage({ sessionId, messageId: streamingMessageId }))
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      dispatch(setLoading({ key: 'isAssistantTyping', value: false }))
      throw error
    }
  }
}

// ============ PHYSICAL EXAM ACTIONS ============

// Fetch physical exam messages for a session
export const fetchPhysicalExamMessages = (sessionId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingPhysicalExamMessages', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/physical-exam/messages`
    const response = await getWithToken(route)

    const { data, pagination } = response.data

    // Transform API data to frontend format
    const transformedMessages = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.senderType === 'user',
      createdAt: msg.createdAt,
      creditsUsed: msg.creditsUsed,
    }))

    dispatch(setPhysicalExamMessages(transformedMessages))
    dispatch(setPhysicalExamMessagesPagination({
      hasMore: pagination.hasMore,
      nextCursor: pagination.nextCursor,
    }))
  } finally {
    dispatch(setLoading({ key: 'isLoadingPhysicalExamMessages', value: false }))
  }
}

// Load more physical exam messages (for infinite scroll - get older messages)
export const loadMorePhysicalExamMessages = (sessionId, cursor) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isLoadingMorePhysicalExamMessages', value: true }))

    const route = `${Endpoints.api.oscePractice}/sessions/${sessionId}/physical-exam/messages?cursor=${cursor}`
    const response = await getWithToken(route)

    const { data, pagination } = response.data

    // Transform API data to frontend format
    const transformedMessages = data.map(msg => ({
      id: msg.id,
      content: msg.content,
      isUser: msg.senderType === 'user',
      createdAt: msg.createdAt,
      creditsUsed: msg.creditsUsed,
    }))

    // Prepend older messages to the beginning
    dispatch(prependPhysicalExamMessages({
      sessionId,
      messages: transformedMessages,
    }))

    dispatch(setPhysicalExamMessagesPagination({
      hasMore: pagination.hasMore,
      nextCursor: pagination.nextCursor,
    }))
  } finally {
    dispatch(setLoading({ key: 'isLoadingMorePhysicalExamMessages', value: false }))
  }
}

// Send physical exam message with streaming
export const sendPhysicalExamMessage = (sessionId, message) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: true }))

    // Add user message immediately (optimistic UI)
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      isUser: true,
      content: message,
      timestamp: new Date().toISOString()
    }
    dispatch(addPhysicalExamMessage({ sessionId, message: tempUserMessage }))

    // Create new AbortController for this stream
    activePhysicalExamAbortController = new AbortController()
    console.log('🆕 Created new Physical Exam AbortController:', activePhysicalExamAbortController)

    // Use streaming
    await sendPhysicalExamMessageStreaming(sessionId, message, dispatch, activePhysicalExamAbortController, tempUserMessage.id)
    console.log('✅ sendPhysicalExamMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Physical Exam stream was stopped by user')
      return
    }
    console.error('❌ sendPhysicalExamMessage caught error:', err)
  } finally {
    console.log('🧹 sendPhysicalExamMessage finally block - clearing activePhysicalExamAbortController')
    dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: false }))
    activePhysicalExamAbortController = null
  }
}

// Stop physical exam streaming
export const stopPhysicalExamStreaming = () => async (dispatch) => {
  try {
    console.log('⏹️ User clicked stop button (Physical Exam)')
    console.log('📋 Current activePhysicalExamAbortController:', activePhysicalExamAbortController)

    physicalExamUserStoppedStreamFlag = true

    // Abort the fetch connection
    if (activePhysicalExamAbortController) {
      console.log('🛑 Aborting active physical exam stream...')
      activePhysicalExamAbortController.abort()
      console.log('✅ Physical exam stream aborted - backend will save partial content')
    } else {
      console.warn('⚠️ No active physical exam abort controller found - stream might have already finished')
    }

    dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: false }))
    dispatch(setLoading({ key: 'isPhysicalExamAssistantTyping', value: false }))
  } catch (error) {
    console.error('Error stopping physical exam stream:', error)
  }
}

// Physical exam streaming implementation
const sendPhysicalExamMessageStreaming = async (sessionId, content, dispatch, abortController, optimisticUserId) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.oscePhysicalExamMessages(sessionId)

  const streamingMessageId = `streaming-pe-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Reset user stopped flag
  physicalExamUserStoppedStreamFlag = false

  // Typing animation state
  let fullContent = ''
  let displayedContent = ''
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null

  const TYPING_SPEED_MS = 1

  // Add initial streaming message and set assistant typing state
  dispatch(addPhysicalExamMessage({
    sessionId,
    message: {
      id: streamingMessageId,
      isUser: false,
      content: '',
      timestamp: messageCreatedAt
    }
  }))
  dispatch(setLoading({ key: 'isPhysicalExamAssistantTyping', value: true }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // If user stopped stream and we've typed everything received, stop
    if (physicalExamUserStoppedStreamFlag && displayedContent.length >= fullContent.length) {
      console.log('✅ Finished typing all received content after stop (Physical Exam)')
      isTyping = false

      // Remove the streaming message and re-add with a non-streaming ID
      dispatch(removePhysicalExamMessage({ sessionId, messageId: streamingMessageId }))
      dispatch(addPhysicalExamMessage({
        sessionId,
        message: {
          id: `partial-pe-${Date.now()}`,
          isUser: false,
          content: displayedContent,
          timestamp: messageCreatedAt
        }
      }))

      dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: false }))
      dispatch(setLoading({ key: 'isPhysicalExamAssistantTyping', value: false }))
      physicalExamUserStoppedStreamFlag = false
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        dispatch(removePhysicalExamMessage({ sessionId, messageId: optimisticUserId }))
        dispatch(removePhysicalExamMessage({ sessionId, messageId: streamingMessageId }))

        if (finalData.userMessage) {
          dispatch(addPhysicalExamMessage({
            sessionId,
            message: {
              id: finalData.userMessage.id,
              isUser: true,
              content: finalData.userMessage.content,
              timestamp: finalData.userMessage.createdAt
            }
          }))
        }
        if (finalData.aiMessage) {
          dispatch(addPhysicalExamMessage({
            sessionId,
            message: {
              id: finalData.aiMessage.id,
              isUser: false,
              content: finalData.aiMessage.content,
              timestamp: finalData.aiMessage.createdAt,
              creditsUsed: finalData.aiMessage.creditsUsed
            }
          }))
        }

        dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: false }))
        dispatch(setLoading({ key: 'isPhysicalExamAssistantTyping', value: false }))
        physicalExamUserStoppedStreamFlag = false
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updatePhysicalExamMessage({
      sessionId,
      messageId: streamingMessageId,
      content: displayedContent
    }))

    // Schedule next character
    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  // Add chunk to content and start typing if needed
  const addChunkToContent = (text) => {
    // If user stopped stream, don't add new chunks
    if (physicalExamUserStoppedStreamFlag) return

    fullContent += text

    // Start typing animation if not already running
    if (!isTyping) {
      typeNextCharacter()
    }
  }

  let buffer = ''

  try {
    console.log('Physical Exam Streaming URL:', route)
    console.log('Sending physical exam message:', content)

    const response = await fetch(route, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({ message: content }),
      signal: abortController?.signal
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('Response error:', response.status, errorText)
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`)
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
              // Check if first chunk contains userQuota and update credit balance
              if (data.data?.userQuota && data.data.userQuota.balance !== undefined) {
                dispatch(pricingActions.updateCreditBalance(data.data.userQuota.balance))
                console.log('💎 Credit balance updated:', data.data.userQuota.balance)
              }

              // Only add chunk if user hasn't stopped the stream
              if (!physicalExamUserStoppedStreamFlag) {
                const chunkContent = data.data?.content || data.content
                addChunkToContent(chunkContent)
              } else {
                console.log('⏸️ Ignoring new chunk - user stopped physical exam stream')
              }
            } else if (data.type === 'done') {
              // Backend saved to database
              backendSavedMessage = true
              finalData = data.data
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError)
          }
        }
      }
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('✅ Physical exam stream aborted by user - typing animation will finish showing all received content')
      return null
    } else {
      console.error('Physical exam streaming error:', error)
      // Clean up on non-abort errors
      dispatch(removePhysicalExamMessage({ sessionId, messageId: optimisticUserId }))
      dispatch(removePhysicalExamMessage({ sessionId, messageId: streamingMessageId }))
      dispatch(setLoading({ key: 'isSendingPhysicalExamMessage', value: false }))
      dispatch(setLoading({ key: 'isPhysicalExamAssistantTyping', value: false }))
      throw error
    }
  }
}
