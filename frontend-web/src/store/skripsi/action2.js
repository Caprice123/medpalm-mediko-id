import { actions } from '@store/skripsi/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken, patchWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const {
  setSets,
  setCurrentSet,
  setCurrentTab,
  setActiveTabId,
  addSet,
  updateSet,
  removeSet,
  updateSetContent,
  setMessagesForTab,
  addMessageToTab,
  updateMessageInTab,
  removeMessageFromTab,
  prependMessagesToTab,
  setDiagramsForTab,
  resetTabMessages,
  setLoading,
  setTabLoading,
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
  } finally {
    dispatch(setLoading({ key: 'isAdminSetLoading', value: false }))
  }
}

export const deleteAdminSet = (setId) => async (dispatch) => {
  try {

    const route = Endpoints.admin.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
  } catch {
    // no need to handle anything because already handled in api.jsx
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
      // Fetch messages for the first tab using new signature
      await dispatch(fetchTabMessages({ tabId: firstTab.id, page: 1, perPage: 50, prepend: false }))
    }

    return set
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
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

export const deleteSet = (setId) => async (dispatch) => {
  try {
    
    const route = Endpoints.api.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// ============= Tabs Management =============

export const fetchTabMessages = ({ tabId, page = 1, perPage = 50, prepend = false }) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isTabMessagesLoading', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/messages`
    const response = await getWithToken(route, { page, perPage })

    const messages = response.data.data || []
    const pagination = response.data.pagination || { page: 1, perPage: 50, isLastPage: false }

    if (prepend) {
      // Prepend older messages at the beginning (for page 2, 3, etc.)
      dispatch(prependMessagesToTab({ tabId, messages }))
    } else {
      // Replace messages (initial load page 1)
      dispatch(setMessagesForTab({ tabId, messages }))
    }

    dispatch(setPagination(pagination))

    return {
      messages,
      pagination
    }
  } finally {
    dispatch(setLoading({ key: 'isTabMessagesLoading', value: false }))
  }
}

export const switchTab = (tab) => async (dispatch, getState) => {
  if (!tab) return

  // Set current tab
  dispatch(setCurrentTab(tab))

  // Check if messages are already cached for this tab
  const cachedMessages = getState().skripsi.messagesByTab[tab.id]

  if (!cachedMessages || cachedMessages.length === 0) {
    // Messages not in cache - fetch from API
    console.log(`📥 Fetching messages for tab ${tab.id}`)
    await dispatch(fetchTabMessages({ tabId: tab.id, page: 1, perPage: 50, prepend: false }))
  } else {
    // Messages already cached - use them directly
    console.log(`✅ Using cached messages for tab ${tab.id} (${cachedMessages.length} messages)`)
  }
}

export const saveSetContent = (setId, editorContent) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingContent', value: true }))

    const route = Endpoints.api.skripsi + `/sets/${setId}/content`
    const response = await putWithToken(route, { editorContent })

    dispatch(updateSetContent({ setId, editorContent }))

    return response.data
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
      dispatch(prependMessagesToTab({ tabId, messages: response.data.data }))
    }

    return {
      hasMore: response.data.hasMore || false
    }
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// Store abort controllers per tab for stream cancellation
const abortControllersByTab = {}
const userStoppedStreamByTab = {}

export const sendMessage = (tabId, message) => async (dispatch) => {
  try {
    // Set loading state for THIS specific tab
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: true }))

    // Add user message immediately (optimistic UI)
    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content: message,
      createdAt: new Date().toISOString()
    }
    dispatch(addMessageToTab({ tabId, message: tempUserMessage }))

    // Create new AbortController for this tab's stream
    abortControllersByTab[tabId] = new AbortController()
    console.log(`🆕 Created new AbortController for tab ${tabId}`)

    // Use streaming for all messages (everything handled in Redux)
    await sendMessageStreaming(tabId, message, dispatch, abortControllersByTab[tabId], tempUserMessage.id)
    console.log('✅ sendMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Skripsi stream was stopped by user')
      return
    }
    console.error('❌ sendMessage caught error:', err)
    // no need to handle anything because already handled in api.jsx
  } finally {
    console.log(`🧹 sendMessage finally block - clearing abort controller for tab ${tabId}`)
    // Clear loading state for THIS specific tab
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    delete abortControllersByTab[tabId]
  }
}

export const stopStreaming = (tabId) => async (dispatch) => {
  try {
    console.log(`⏹️ User clicked stop button for tab ${tabId}`)

    // Set flag so typing animation knows stream was stopped
    userStoppedStreamByTab[tabId] = true

    // Abort the fetch for this specific tab
    const controller = abortControllersByTab[tabId]
    if (controller) {
      console.log(`🛑 Aborting stream for tab ${tabId}...`)
      controller.abort()
      console.log('✅ Stream aborted - backend will save partial content')
    } else {
      console.warn(`⚠️ No active abort controller found for tab ${tabId}`)
    }

    return null
  } catch {
    console.error('Error stopping stream:', error)
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
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

  // Reset user stopped flag for this tab
  userStoppedStreamByTab[tabId] = false

  // Typing animation state
  let fullContent = '' // Complete content from backend chunks
  let displayedContent = '' // Content currently displayed with typing animation
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null
  let frozenCharCount = null // Character count when user clicked stop
  let savedMessageId = null // Store messageId when 'done' arrives

  const TYPING_SPEED_MS = 1 // 1ms per character (~1000 chars/sec) - fast but still smooth

  // Add initial streaming message
  dispatch(addMessageToTab({
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
    // If user stopped stream, freeze immediately at current position
    if (userStoppedStreamByTab[tabId]) {
      if (frozenCharCount === null) {
        // Record the character count when user stopped (first time flag is detected)
        frozenCharCount = displayedContent.length
        console.log(`⏸️ User stopped - freezing at ${frozenCharCount} characters`)
      }

      // Stop typing animation immediately
      isTyping = false

      // Wait for backend to send message ID, then we'll truncate in the 'done' handler
      // Don't finalize yet - wait for backend
      return
    }

    // If all characters displayed
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      // If backend is done and all characters displayed, finalize
      if (backendSavedMessage && finalData) {
        dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
        dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

        if (finalData.userMessage) {
          dispatch(addMessageToTab({ tabId, message: finalData.userMessage }))
        }
        if (finalData.aiMessage) {
          dispatch(addMessageToTab({ tabId, message: finalData.aiMessage }))
        }

        dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
        userStoppedStreamByTab[tabId] = false
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessageInTab({
      tabId,
      messageId: streamingMessageId,
      updates: { content: displayedContent }
    }))

    // Schedule next character
    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  // Add chunk to content and start typing if needed
  const addChunkToContent = (text) => {
    // If user stopped stream, don't add new chunks
    if (userStoppedStreamByTab[tabId]) return

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
              if (!userStoppedStreamByTab[tabId]) {
                addChunkToContent(data.data.content)
              } else {
                console.log('⏸️ Ignoring new chunk - user stopped stream')
              }
            } else if (data.type === 'done') {
              // Backend saved to database (full or partial)
              backendSavedMessage = true
              finalData = data.data

              // Store messageId for potential truncation in abort handler
              if (data.data.aiMessage) {
                savedMessageId = data.data.aiMessage.id
              }

              console.log('✅ Backend saved messages:', data.data)

              // If typing animation already caught up, finalize immediately
              if (!isTyping && displayedContent.length >= fullContent.length) {
                dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
                dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

                if (data.data.userMessage) {
                  dispatch(addMessageToTab({ tabId, message: data.data.userMessage }))
                }
                if (data.data.aiMessage) {
                  dispatch(addMessageToTab({ tabId, message: data.data.aiMessage }))
                }

                dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
                userStoppedStreamByTab[tabId] = false
                return data.data
              }
              // Otherwise, let typing animation finish and it will finalize
            } else if (data.type === 'error') {
              throw new Error(data.error)
            }
          } catch {
            console.error('Error parsing SSE data:', parseError)
          }
        }
      }
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('✅ Stream aborted by user')

      // Record the frozen character count at abort time
      const charCount = displayedContent.length
      console.log(`⏸️ User stopped at ${charCount} characters`)

      // If we have the messageId (done event already arrived), truncate NOW
      if (savedMessageId && charCount > 0) {
        console.log(`✂️ Truncating message ${savedMessageId} to ${charCount} characters`)

        try {
          const truncateUrl = `${Endpoints.api.skripsi}/tabs/${tabId}/messages/${savedMessageId}/truncate`
          await patchWithToken(truncateUrl, { characterCount: charCount })
          console.log('✅ Message truncated successfully')

          // Update final data content
          if (finalData && finalData.aiMessage) {
            finalData.aiMessage.content = finalData.aiMessage.content.substring(0, charCount)
          }

          // Finalize UI
          dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
          dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

          if (finalData.userMessage) {
            dispatch(addMessageToTab({ tabId, message: finalData.userMessage }))
          }
          if (finalData.aiMessage) {
            dispatch(addMessageToTab({ tabId, message: finalData.aiMessage }))
          }

          dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
          userStoppedStreamByTab[tabId] = false
        } catch (truncateError) {
          console.error('❌ Failed to truncate message:', truncateError)
        }
      }

      return null
    } else {
      console.error('Streaming error:', error)
      // Clean up on non-abort errors
      dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
      dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
      dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
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

    const { data } = response.data

    // Refresh diagram history after generation
    await dispatch(fetchDiagramHistory(tabId))

    return data
  } catch {
    // no need to handle anything because already handled in api.jsx
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

    // Store as tab diagrams using new action
    dispatch(setDiagramsForTab({ tabId, diagrams }))

    return diagrams
  } finally {
    dispatch(setLoading({ key: 'isDiagramHistoryLoading', value: false }))
  }
}

export const fetchDiagramDetail = (diagramId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isDiagramDetailLoading', value: true }))

    const route = Endpoints.api.skripsi + `/diagrams/${diagramId}`
    const response = await getWithToken(route)

    return response.data.data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isDiagramDetailLoading', value: false }))
  }
}

export const updateDiagram = (diagramId, diagramData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isUpdatingDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/diagrams/${diagramId}`
    const response = await putWithToken(route, { diagramData })

    return response.data.data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isUpdatingDiagram', value: false }))
  }
}

export const saveTabDiagram = (tabId, diagramData) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingTabDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/diagram`
    const response = await putWithToken(route, { diagramData })

    return response.data.data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSavingTabDiagram', value: false }))
  }
}

export const createDiagram = (tabId, diagramData, diagramConfig = {}, creationMethod = 'manual') => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isCreatingDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/diagrams/manual`
    const response = await postWithToken(route, { diagramData, diagramConfig, creationMethod })

    // Refresh diagram history after creation
    await dispatch(fetchDiagramHistory(tabId))

    return response.data.data
  } catch {
    // no need to handle anything because already handled in api.jsx
    throw err
  } finally {
    dispatch(setLoading({ key: 'isCreatingDiagram', value: false }))
  }
}
