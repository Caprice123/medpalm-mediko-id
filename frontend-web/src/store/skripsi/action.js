import { actions } from '@store/skripsi/reducer'
import { actions as commonActions } from '@store/common/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'
import { setTimeout, setInterval, clearTimeout, clearInterval } from 'worker-timers'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const {
  setSets,
  setCurrentSet,
  setCurrentTab,
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
  setStreamingState,
  clearStreamingState,
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

export const sendMessage = (tabId, message) => async (dispatch, getState) => {
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

    // Initialize streaming state for this tab
    dispatch(setStreamingState({
      tabId,
      isSending: true,
      isTyping: false,
      userStopped: false,
      userMessage: message,
      streamingMessageId: null,
      optimisticUserId: tempUserMessage.id,
      realMessageId: null,
      realUserMessageId: null,
      displayedContent: '',
      displayedLength: 0
    }))

    // Create new AbortController for this tab's stream
    abortControllersByTab[tabId] = new AbortController()
    console.log(`🆕 Created new AbortController for tab ${tabId}`)

    // Use streaming for all messages (everything handled in Redux)
    await sendMessageStreaming(tabId, message, dispatch, getState, abortControllersByTab[tabId], tempUserMessage.id)
    console.log('✅ sendMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Skripsi stream was stopped by user')
      return
    }
    console.error('❌ sendMessage caught error:', err)
    // Dispatch error to common reducer
    dispatch(commonActions.setError(err.message || 'Terjadi kesalahan saat mengirim pesan'))
  } finally {
    console.log(`🧹 sendMessage finally block - clearing abort controller for tab ${tabId}`)
    // Clear loading state for THIS specific tab
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    delete abortControllersByTab[tabId]
  }
}

export const finalizeMessage = (tabId, messageId, content, isComplete) => async () => {
  try {
    console.log(`📝 Finalizing message ${messageId} as ${isComplete ? 'completed' : 'truncated'}`)

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/messages/${messageId}/finalize`
    const response = await postWithToken(route, {
      content: content,
      isComplete: isComplete
    })

    console.log('✅ Message finalized successfully')
    return response.data
  } catch (err) {
    console.error('❌ Error finalizing message:', err)
    throw err
  }
}

export const stopStreaming = (tabId) => async (dispatch, getState) => {
  try {
    console.log(`⏹️ User clicked stop button for tab ${tabId}`)

    // Set flag to stop receiving new chunks and typing
    dispatch(setStreamingState({
      tabId,
      userStopped: true,
      isTyping: false
    }))

    // Abort the fetch for this specific tab
    const controller = abortControllersByTab[tabId]
    if (controller) {
      console.log(`🛑 Aborting stream for tab ${tabId}...`)
      controller.abort()
      console.log('✅ Stream aborted')
    } else {
      console.warn(`⚠️ No active abort controller found for tab ${tabId}`)
    }

    // Get the streaming state from redux
    const state = getState()
    const streamingState = state.skripsi.streamingStateByTab[tabId]

    if (streamingState && streamingState.realMessageId && streamingState.displayedContent) {
      console.log(`📝 Finalizing truncated message: messageId=${streamingState.realMessageId}, content length=${streamingState.displayedContent.length}`)

      // Call finalize endpoint with the exact displayed content
      try {
        const response = await dispatch(finalizeMessage(
          tabId,
          streamingState.realMessageId,
          streamingState.displayedContent,
          false // isComplete = false (truncated)
        ))

        // Remove temporary messages
        if (streamingState.streamingMessageId) {
          dispatch(removeMessageFromTab({ tabId, messageId: streamingState.streamingMessageId }))
        }
        if (streamingState.optimisticUserId) {
          dispatch(removeMessageFromTab({ tabId, messageId: streamingState.optimisticUserId }))
        }

        // Add the user message with real ID
        if (streamingState.userMessage && streamingState.realUserMessageId) {
          dispatch(addMessageToTab({
            tabId,
            message: {
              id: streamingState.realUserMessageId,
              senderType: 'user',
              content: streamingState.userMessage,
              createdAt: new Date().toISOString()
            }
          }))
        }

        // Add the AI message with truncated content
        if (response.data) {
          dispatch(addMessageToTab({
            tabId,
            message: {
              id: response.data.id,
              senderType: 'ai',
              content: response.data.content,
              sources: response.data.sources || [],
              createdAt: response.data.updatedAt
            }
          }))
        }

      } catch (err) {
        console.error('❌ Error finalizing message:', err)
      }
    } else {
      console.log('⚠️ No streaming state found, cannot finalize')
    }

    // Clean up streaming state
    dispatch(clearStreamingState(tabId))
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))

    return null
  } catch (error) {
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

// Streaming message handler - typing animation with backend pacing (same as chatbot)
const sendMessageStreaming = async (tabId, content, dispatch, getState, abortController, optimisticUserId) => {
  // Ensure token is valid and refreshed if needed
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.skripsi + `/tabs/${tabId}/messages`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Typing animation state
  let fullContent = '' // Complete content from backend chunks
  let displayedContent = '' // Content currently displayed with typing animation
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null
  const sources = [] // Collect citations as they come in
  let showSources = false // Only show after streaming completes

  const TYPING_SPEED_MS = 1 // 1ms per character (~1000 chars/sec) - fast but still smooth

  // Update streaming state with streamingMessageId
  dispatch(setStreamingState({
    tabId,
    streamingMessageId
  }))

  // Add initial streaming message
  dispatch(addMessageToTab({
    tabId,
    message: {
      id: streamingMessageId,
      senderType: 'ai',
      content: '',
      sources: [],
      createdAt: messageCreatedAt
    }
  }))

  // Typing animation - type character by character
  const typeNextCharacter = () => {
    // Check if user stopped stream from Redux state
    const state = getState()
    const streamingState = state.skripsi.streamingStateByTab[tabId]

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
        const finalizeAsync = async () => {
          try {
            const response = await dispatch(finalizeMessage(
              tabId,
              finalData.aiMessage.id,
              fullContent,
              true // isComplete = true
            ))

            // Remove temp messages
            dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
            dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

            // Add final messages
            if (finalData.userMessage) {
              dispatch(addMessageToTab({ tabId, message: finalData.userMessage }))
            }
            console.log(response)
            if (finalData.aiMessage) {
              dispatch(addMessageToTab({
                tabId,
                message: {
                  ...finalData.aiMessage,
                  content: fullContent, // Use full content
                  sources: response.data.sources || [],
                }
              }))
            }

            dispatch(clearStreamingState(tabId))
            dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
          } catch (error) {
            console.error('❌ Error finalizing completed message:', error)
          }
        }

        finalizeAsync()
      }
      return
    }

    isTyping = true
    // Display next character
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessageInTab({
      tabId,
      messageId: streamingMessageId,
      updates: {
        content: displayedContent,
        sources: (showSources) ? sources : [] // Only show sources after typing completes
      }
    }))

    // Update streaming state with current displayed content
    if (finalData && finalData.aiMessage && finalData.aiMessage.id) {
      dispatch(setStreamingState({
        tabId,
        realMessageId: finalData.aiMessage.id,
        realUserMessageId: finalData.userMessage ? finalData.userMessage.id : null,
        displayedContent: displayedContent,
        displayedLength: displayedContent.length,
        isTyping: true
      }))
    } else {
      // Just update typing state
      dispatch(setStreamingState({
        tabId,
        displayedContent: displayedContent,
        displayedLength: displayedContent.length,
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
    const streamingState = state.skripsi.streamingStateByTab[tabId]

    if (streamingState?.userStopped) return

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

            if (data.type === 'started') {
              // Backend created message records - store their IDs
              const { userMessage, aiMessage } = data.data
              dispatch(setStreamingState({
                tabId,
                realUserMessageId: userMessage.id,
                realMessageId: aiMessage.id,
              }))
              console.log('🆔 Stored real message IDs:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })
            } else if (data.type === 'chunk') {
              // Check if first chunk contains userQuota and update credit balance
              if (data.data?.userQuota && data.data.userQuota.balance !== undefined) {
                dispatch(pricingActions.updateCreditBalance(data.data.userQuota.balance))
                console.log('💎 Credit balance updated:', data.data.userQuota.balance)
              }

              // Only add chunk if user hasn't stopped the stream
              const state = getState()
              const streamingState = state.skripsi.streamingStateByTab[tabId]

              if (!streamingState?.userStopped) {
                addChunkToContent(data.data.content)
              } else {
                console.log('⏸️ Ignoring new chunk - user stopped stream')
              }
            } else if (data.type === 'citation') {
              // Collect citation but don't show yet (wait until streaming completes)
              const newSource = {
                url: data.data.url,
                title: data.data.title
              }
              sources.push(newSource)
              console.log('📚 Citation received:', newSource)
            } else if (data.type === 'done') {
              // Backend created messages with status='streaming'
              backendSavedMessage = true
              finalData = data.data
              showSources = true // Now we can show sources since streaming is complete

              // Use filtered sources from backend (only citations actually used in the response)
              if (data.data.sources && data.data.sources.length > 0) {
                sources.length = 0 // Clear all collected citations
                sources.push(...data.data.sources) // Use only filtered sources from backend
              }

              // Store messageId for finalization
              if (data.data.aiMessage) {
                // savedMessageId = data.data.aiMessage.id
              }

              console.log('✅ Backend created streaming messages:', data.data)
              console.log('✅ Filtered citations ready to display:', sources.length)

              // If typing animation already caught up, finalize immediately
              if (!isTyping && displayedContent.length >= fullContent.length) {
                // Call finalize endpoint with complete content
                const finalizeAsync = async () => {
                  try {
                    const response = await dispatch(finalizeMessage(
                      tabId,
                      data.data.aiMessage.id,
                      fullContent,
                      true // isComplete = true
                    ))

                    // Remove temp messages
                    dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
                    dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

                    // Add final messages
                    if (data.data.userMessage) {
                      dispatch(addMessageToTab({ tabId, message: data.data.userMessage }))
                    }
                    console.log("SOURCES", response.data.sources)
                    if (data.data.aiMessage) {
                      dispatch(addMessageToTab({
                        tabId,
                        message: {
                          ...data.data.aiMessage,
                          content: fullContent, // Use full content
                          sources: response.data.sources // Include collected sources
                        }
                      }))
                    }

                    dispatch(clearStreamingState(tabId))
                    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
                  } catch (error) {
                    console.error('❌ Error finalizing completed message:', error)
                  }
                }

                finalizeAsync()
                return data.data
              }
              // Otherwise, let typing animation finish and it will finalize
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
      console.log('✅ Stream aborted by user')
      // stopStreaming action will handle finalization with Redux streaming state
      console.log('⏸️ User stopped - stopStreaming will handle finalization')
      return null
    } else {
      console.error('❌ Streaming error:', error)

      // If we have partial content and backend created the message, save it
      if (finalData && finalData.aiMessage && fullContent.length > 0) {
        try {
          console.log(`💾 Saving partial message due to error: ${fullContent.length} characters`)

          // Finalize with partial content
          const response = await dispatch(finalizeMessage(
            tabId,
            finalData.aiMessage.id,
            fullContent,
            false // isComplete = false (error during streaming)
          ))

          // Remove temporary messages
          dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
          dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))

          // Add final messages
          if (finalData.userMessage) {
            dispatch(addMessageToTab({ tabId, message: finalData.userMessage }))
          }

          console.log("RESPONSE: ", response.data)
          dispatch(addMessageToTab({
            tabId,
            message: {
              ...finalData.aiMessage,
              content: '', // Empty as saved in backend
              sources: response.data.sources, // Include collected sources
              status: 'error' // Mark as error status
            }
          }))

          console.log('✅ Partial message saved successfully')
        } catch (saveError) {
          console.error('❌ Failed to save partial message:', saveError)
        }
      } else {
        // If no partial content to save, just clean up temporary messages
        dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
        dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
      }

      // Dispatch error to common reducer
      dispatch(commonActions.setError(error.message || 'Terjadi kesalahan saat streaming pesan'))

      dispatch(clearStreamingState(tabId))
      dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
      return null
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
  } finally {
    dispatch(setLoading({ key: 'isCreatingDiagram', value: false }))
  }
}
