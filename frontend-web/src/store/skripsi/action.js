import { actions } from '@store/skripsi/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const {
  setSets,
  setCurrentSet,
  setCurrentTab,
  addSet,
  updateSet,
  removeSet,
  updateSetContent,
  setTabMessages,
  setDiagrams,
  addMessage,
  updateMessage,
  removeMessage,
  setLoading,
  setPagination,
} = actions

// ============= Admin Sets Management =============

export const fetchAdminSets = () => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isSetsLoading', value: true }))

    const { filters, pagination } = getState().skripsi
    const queryParams = {
      page: pagination.page,
      perPage: pagination.perPage
    }

    if (filters?.search) queryParams.search = filters.search
    if (filters?.mode) queryParams.mode = filters.mode
    if (filters?.userId) queryParams.userId = filters.userId

    const route = Endpoints.admin.skripsi + "/sets"
    const response = await getWithToken(route, queryParams)

    dispatch(setSets(response.data.data || []))
    dispatch(setPagination(response.data.pagination || {}))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSetsLoading', value: false }))
  }
}

export const fetchAdminSet = (setId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isAdminSetLoading', value: true }))

    const route = Endpoints.admin.skripsi + `/sets/${setId}`
    const response = await getWithToken(route)
    const set = response.data.data

    return set
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isAdminSetLoading', value: false }))
  }
}

export const deleteAdminSet = (setId) => async (dispatch) => {
  try {

    const route = Endpoints.admin.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// ============= Sets Management =============

export const fetchSets = (page = 1, perPage = 20) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetsLoading', value: true }))
    
    const route = Endpoints.api.skripsi + "/sets"
    const response = await getWithToken(route, { page, perPage })

    dispatch(setSets(response.data.data || []))
    dispatch(setPagination(response.data.pagination || {}))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSetsLoading', value: false }))
  }
}

export const createSet = (title, description) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetLoading', value: true }))
    
    const route = Endpoints.api.skripsi + "/sets"
    const response = await postWithToken(route, { title, description })
    const newSet = response.data.data

    dispatch(addSet(newSet))

    return newSet
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSetLoading', value: false }))
  }
}

export const fetchSet = (setId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetLoading', value: true }))

    const route = Endpoints.api.skripsi + `/sets/${setId}`
    const response = await getWithToken(route)
    const set = response.data.data

    dispatch(setCurrentSet(set))

    // Set first tab as current and fetch its messages
    if (set.tabs && set.tabs.length > 0) {
      const firstTab = set.tabs[0]
      dispatch(setCurrentTab(firstTab))
      // Fetch messages for the first tab
      await dispatch(fetchTabMessages(firstTab.id))
    }

    return set
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSetLoading', value: false }))
  }
}

export const updateSetInfo = (setId, title, description) => async (dispatch) => {
  try {
    
    const route = Endpoints.api.skripsi + `/sets/${setId}`
    const response = await putWithToken(route, { title, description })
    const updatedSet = response.data.data

    dispatch(updateSet(updatedSet))

    return updatedSet
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

export const deleteSet = (setId) => async (dispatch) => {
  try {
    
    const route = Endpoints.api.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// ============= Tabs Management =============

export const fetchTabMessages = (tabId, limit = 50) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTabMessagesLoading', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/messages`
    const response = await getWithToken(route, { limit })

    const messages = response.data.data || []
    dispatch(setTabMessages({ tabId, messages }))

    return {
      messages,
      hasMore: response.data.hasMore || false
    }
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isTabMessagesLoading', value: false }))
  }
}

export const switchTab = (tab) => async (dispatch) => {
  dispatch(setCurrentTab(tab))
  // Fetch messages for the switched tab if not already loaded
  if (tab && (!tab.messages || tab.messages.length === 0)) {
    await dispatch(fetchTabMessages(tab.id))
  }
}

export const saveSetContent = (setId, editorContent) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingContent', value: true }))

    const route = Endpoints.api.skripsi + `/sets/${setId}/content`
    const response = await putWithToken(route, { editorContent })

    dispatch(updateSetContent({ setId, editorContent }))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isSavingContent', value: false }))
  }
}

export const loadOlderMessages = (tabId, beforeMessageId) => async (dispatch) => {
  try {
    const route = Endpoints.api.skripsi + `/tabs/${tabId}/messages`
    const response = await getWithToken(route, {
      limit: 50,
      beforeMessageId: beforeMessageId
    })

    if (response.data.data && response.data.data.length > 0) {
      dispatch(actions.prependMessages({ tabId, messages: response.data.data }))
    }

    return {
      hasMore: response.data.hasMore || false
    }
  } catch (err) {
    handleApiError(err, dispatch)
  }
}

// Store active abort controller for stream cancellation
let activeAbortController = null

export const sendMessage = (tabId, message) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSendingMessage', value: true }))

    // Add user message immediately (optimistic UI)
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content: message,
      createdAt: new Date().toISOString()
    }
    dispatch(addMessage({ tabId, message: tempUserMessage }))

    // Create new AbortController for this stream
    activeAbortController = new AbortController()
    console.log('🆕 Created new AbortController:', activeAbortController)

    // Use streaming for all messages (everything handled in Redux)
    await sendMessageStreaming(tabId, message, dispatch, activeAbortController, tempUserMessage.id)
    console.log('✅ sendMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Skripsi stream was stopped by user')
      return
    }
    console.error('❌ sendMessage caught error:', err)
    handleApiError(err, dispatch)
  } finally {
    console.log('🧹 sendMessage finally block - clearing activeAbortController')
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    activeAbortController = null
  }
}

// Track if user stopped the stream (module level variable shared with sendMessage)
let userStoppedStreamFlag = false

export const stopStreaming = () => async (dispatch) => {
  try {
    console.log('⏹️ User clicked stop button')
    console.log('📋 Current activeAbortController:', activeAbortController)

    userStoppedStreamFlag = true // Set flag so typing animation knows stream was stopped

    // Abort the fetch connection to stop backend from generating more content
    if (activeAbortController) {
      console.log('🛑 Aborting active stream...')
      activeAbortController.abort()
      console.log('✅ Stream aborted - backend will save partial content')
    } else {
      console.warn('⚠️ No active abort controller found - stream might have already finished')
    }

    // Note: typing animation will continue showing received content
    // The sendMessage action will handle cleanup when typing completes
    return null
  } catch (error) {
    console.error('Error stopping stream:', error)
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    return null
  }
}

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

// Streaming message handler - typing animation with backend pacing (copied from chatbot)
const sendMessageStreaming = async (tabId, content, dispatch, abortController, optimisticUserId) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.skripsi + `/tabs/${tabId}/messages`

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

  const TYPING_SPEED_MS = 10 // 10ms per character (backend delays based on chunk length × 10ms)

  // Add initial streaming message
  dispatch(addMessage({
    tabId,
    message: {
      id: streamingMessageId,
      senderType: 'ai',
      content: '',
      createdAt: messageCreatedAt
    }
  }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // If user stopped stream and we've typed everything received, stop
    if (userStoppedStreamFlag && displayedContent.length >= fullContent.length) {
      console.log('✅ Finished typing all received content after stop - keeping messages visible')
      isTyping = false

      // Remove the streaming message and re-add with a non-streaming ID
      // This makes the stop button disappear while keeping the message visible
      dispatch(removeMessage({ tabId, messageId: streamingMessageId }))
      dispatch(addMessage({
        tabId,
        message: {
          id: `partial-${Date.now()}`, // Use 'partial-' prefix instead of 'streaming-'
          senderType: 'ai',
          content: displayedContent,
          createdAt: messageCreatedAt
        }
      }))

      // Backend is saving to database in background
      // When user refreshes, they'll see the saved messages from database

      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      userStoppedStreamFlag = false
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        dispatch(removeMessage({ tabId, messageId: optimisticUserId }))
        dispatch(removeMessage({ tabId, messageId: streamingMessageId }))

        if (finalData.userMessage) {
          dispatch(addMessage({ tabId, message: finalData.userMessage }))
        }
        if (finalData.aiMessage) {
          dispatch(addMessage({ tabId, message: finalData.aiMessage }))
        }

        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
        userStoppedStreamFlag = false
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessage({
      tabId,
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
              // Only add chunk if user hasn't stopped the stream
              if (!userStoppedStreamFlag) {
                addChunkToContent(data.data.content)
              } else {
                console.log('⏸️ Ignoring new chunk - user stopped stream')
              }
            } else if (data.type === 'done') {
              // Backend saved to database (full or partial)
              backendSavedMessage = true
              finalData = data.data
              // Don't finalize here - let the typing animation complete first
              // The typeNextCharacter function will handle finalization
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
      // Backend is saving partial message in background
      // Typing animation will handle setting loading state to false when done
      // Don't clear messages, don't throw error
      return null
    } else {
      console.error('Streaming error:', error)
      // Clean up on non-abort errors
      dispatch(removeMessage({ tabId, messageId: optimisticUserId }))
      dispatch(removeMessage({ tabId, messageId: streamingMessageId }))
      dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      throw error
    }
  }
}

// ============= Diagram Builder =============

export const generateDiagram = (tabId, diagramConfig) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/diagrams`
    const response = await postWithToken(route, diagramConfig)

    const { diagramId, diagram } = response.data.data

    // Refresh diagram history after generation
    await dispatch(fetchDiagramHistory(tabId))

    return { diagramId, diagram }
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isGeneratingDiagram', value: false }))
  }
}

export const fetchDiagramHistory = (tabId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDiagramHistoryLoading', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/diagrams`
    const response = await getWithToken(route)

    const diagrams = response.data.data || []

    // Store as tab diagrams
    dispatch(setDiagrams({ tabId, diagrams }))

    return diagrams
  } catch (err) {
    handleApiError(err, dispatch)
  } finally {
    dispatch(setLoading({ key: 'isDiagramHistoryLoading', value: false }))
  }
}

export const updateDiagram = (diagramId, diagramData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/diagrams/${diagramId}`
    const response = await putWithToken(route, { diagramData })

    return response.data.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDiagram', value: false }))
  }
}
