import { actions } from '@store/skripsi/reducer'
import { actions as commonActions } from '@store/common/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import Endpoints from '@config/endpoint'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'
import { refreshAccessToken } from '../../config/api'
import { setTimeout } from 'worker-timers'

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
  setModeForTab,
  setAvailableModes,
  setCosts,
  setUserInformation,
  setLoading,
  setTabLoading,
  setPagination,
} = actions

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

export const createSet = (title, description, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetLoading', value: true }))

    const route = Endpoints.api.skripsi + "/sets"
    const response = await postWithToken(route, { title, description })
    const newSet = response.data.data

    dispatch(addSet(newSet))
    if (onSuccess) {
      onSuccess(newSet)
    }
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
      await dispatch(fetchTabMessages({ tabId: firstTab.id, page: 1, perPage: 50, prepend: false }))
    }

    return set
  } finally {
    dispatch(setLoading({ key: 'isSetLoading', value: false }))
  }
}

export const updateSetInfo = (setId, title, description, onSuccess) => async (dispatch) => {
    const route = Endpoints.api.skripsi + `/sets/${setId}`
    const response = await putWithToken(route, { title, description })
    const updatedSet = response.data.data

    dispatch(updateSet(updatedSet))
    if (onSuccess) {
      onSuccess(updatedSet)
    }

    return updatedSet
}

export const deleteSet = (setId, onSuccess) => async (dispatch) => {
    const route = Endpoints.api.skripsi + `/sets/${setId}`
    await deleteWithToken(route)

    dispatch(removeSet(setId))
    if (onSuccess) {
      onSuccess(setId)
    }
}

// ============= Mode Configuration =============

export const fetchModeConfiguration = () => async (dispatch) => {
  try {
    const route = Endpoints.api.skripsi + '/config'
    const response = await getWithToken(route)
    const config = response.data.data

    console.log('📊 Skripsi Mode Configuration:', config)
    console.log('💰 Costs:', config.costs)

    dispatch(setAvailableModes(config.availableModes))
    dispatch(setCosts(config.costs))
    if (config.userInformation) {
      dispatch(setUserInformation(config.userInformation))
    }

    return config
  } catch (err) {
    console.error('Error fetching mode configuration:', err)
    dispatch(setAvailableModes({ research: true, validated: true }))
    dispatch(setCosts({ research: 0, validated: 0 }))
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
      dispatch(prependMessagesToTab({ tabId, messages }))
    } else {
      dispatch(setMessagesForTab({ tabId, messages }))
    }

    dispatch(setPagination(pagination))

    return { messages, pagination }
  } finally {
    dispatch(setLoading({ key: 'isTabMessagesLoading', value: false }))
  }
}

export const switchTab = (tab) => async (dispatch, getState) => {
  if (!tab) return

  dispatch(setCurrentTab(tab))

  const cachedMessages = getState().skripsi.messagesByTab[tab.id]

  if (!cachedMessages || cachedMessages.length === 0) {
    console.log(`📥 Fetching messages for tab ${tab.id}`)
    await dispatch(fetchTabMessages({ tabId: tab.id, page: 1, perPage: 50, prepend: false }))
  } else {
    console.log(`✅ Using cached messages for tab ${tab.id} (${cachedMessages.length} messages)`)
  }
}

export const saveSetContent = (setId, editorContent, onSuccess) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingContent', value: true }))

    const route = Endpoints.api.skripsi + `/sets/${setId}/content`
    await putWithToken(route, { editorContent })

    dispatch(updateSetContent({ setId, editorContent }))
    if (onSuccess) {
      onSuccess()
    }
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

    return { hasMore: response.data.hasMore || false }
  } catch {
    // no need to handle anything because already handled in api.jsx
  }
}

// Store abort controllers per tab for stream cancellation
const abortControllersByTab = {}

export const sendMessage = (tabId, message, modeType) => async (dispatch, getState) => {
  try {
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: true }))

    const state = getState()
    const mode = modeType || state.skripsi.modeByTab[tabId] || 'validated'

    if (!state.skripsi.modeByTab[tabId]) {
      dispatch(setModeForTab({ tabId, mode }))
    }

    const tempUserMessage = {
      id: `temp-user-${Date.now()}`,
      senderType: 'user',
      content: message,
      modeType: mode,
      createdAt: new Date().toISOString()
    }
    dispatch(addMessageToTab({ tabId, message: tempUserMessage }))

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

    abortControllersByTab[tabId] = new AbortController()
    console.log(`🆕 Created new AbortController for tab ${tabId}`)

    await sendMessageStreaming(tabId, message, mode, dispatch, getState, abortControllersByTab[tabId], tempUserMessage.id)
    console.log('✅ sendMessageStreaming completed')
  } catch (err) {
    if (err.name === 'AbortError') {
      console.log('Skripsi stream was stopped by user')
      return
    }
    console.error('❌ sendMessage caught error:', err)
    dispatch(commonActions.setError(err.message || 'Terjadi kesalahan saat mengirim pesan'))
  } finally {
    console.log(`🧹 sendMessage finally block - clearing abort controller for tab ${tabId}`)
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    delete abortControllersByTab[tabId]
  }
}

export const finalizeMessage = (tabId, messageId, content, isComplete) => async () => {
    console.log(`📝 Finalizing message ${messageId} as ${isComplete ? 'completed' : 'truncated'}`)

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/messages/${messageId}/finalize`
    const response = await postWithToken(route, {
      content: content,
      isComplete: isComplete
    })

    console.log('✅ Message finalized successfully')
    return response.data
}

export const stopStreaming = (tabId) => async (dispatch, getState) => {
  try {
    console.log(`⏹️ User clicked stop button for tab ${tabId}`)

    dispatch(setStreamingState({
      tabId,
      userStopped: true,
      isTyping: false
    }))

    const controller = abortControllersByTab[tabId]
    if (controller) {
      console.log(`🛑 Aborting stream for tab ${tabId}...`)
      controller.abort()
      console.log('✅ Stream aborted')
    } else {
      console.warn(`⚠️ No active abort controller found for tab ${tabId}`)
    }

    const state = getState()
    const streamingState = state.skripsi.streamingStateByTab[tabId]

    if (streamingState && streamingState.realMessageId && streamingState.displayedContent) {
      console.log(`📝 Finalizing truncated message: messageId=${streamingState.realMessageId}, content length=${streamingState.displayedContent.length}`)

      try {
        const response = await dispatch(finalizeMessage(
          tabId,
          streamingState.realMessageId,
          streamingState.displayedContent,
          false
        ))

        if (streamingState.streamingMessageId) {
          dispatch(removeMessageFromTab({ tabId, messageId: streamingState.streamingMessageId }))
        }
        if (streamingState.optimisticUserId) {
          dispatch(removeMessageFromTab({ tabId, messageId: streamingState.optimisticUserId }))
        }

        if (streamingState.userMessage && streamingState.realUserMessageId) {
          dispatch(addMessageToTab({
            tabId,
            message: {
              id: streamingState.realUserMessageId,
              senderType: 'user',
              content: streamingState.userMessage,
              modeType: response.data?.modeType || state.skripsi.modeByTab[tabId] || 'validated',
              createdAt: new Date().toISOString()
            }
          }))
        }

        if (response.data) {
          dispatch(addMessageToTab({
            tabId,
            message: {
              id: response.data.id,
              senderType: 'ai',
              content: response.data.content,
              modeType: response.data.modeType || state.skripsi.modeByTab[tabId] || 'validated',
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

  const isTokenExpired = (isoString) => {
    const now = new Date()
    const targetDate = new Date(isoString)
    return targetDate < now
  }

  if (isTokenExpired(token.accessTokenExpiresAt)) {
    return await refreshAccessToken()
  }

  return token.accessToken
}

// Streaming message handler - typing animation with backend pacing
const sendMessageStreaming = async (tabId, content, modeType, dispatch, getState, abortController, optimisticUserId) => {
  const accessToken = await ensureValidToken()
  const route = API_BASE_URL + Endpoints.api.skripsi + `/tabs/${tabId}/messages`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  let fullContent = ''
  let displayedContent = ''
  let isTyping = false
  let backendSavedMessage = false
  let finalData = null
  const sources = []
  let showSources = false
  let finalized = false

  const TYPING_SPEED_MS = 1

  dispatch(setStreamingState({ tabId, streamingMessageId }))

  dispatch(addMessageToTab({
    tabId,
    message: {
      id: streamingMessageId,
      senderType: 'ai',
      content: '',
      modeType: modeType,
      sources: [],
      createdAt: messageCreatedAt
    }
  }))

  // Replaces optimistic/streaming placeholders with the finalized real messages
  const applyFinalizedMessage = ({ userMessage, aiMessage, content: finalContent, sources: finalSources, status }) => {
    dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
    dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
    if (userMessage) {
      dispatch(addMessageToTab({
        tabId,
        message: { ...userMessage, modeType: userMessage.modeType || modeType }
      }))
    }
    if (aiMessage) {
      dispatch(addMessageToTab({
        tabId,
        message: {
          ...aiMessage,
          content: finalContent,
          sources: finalSources || [],
          modeType: aiMessage.modeType || modeType,
          ...(status && { status })
        }
      }))
    }
    dispatch(clearStreamingState(tabId))
    dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
  }

  // Calls the finalize API then swaps in the real messages — used by both the
  // typing-complete path and the 'done' event path
  const runFinalize = async () => {
    try {
      const response = await dispatch(finalizeMessage(tabId, finalData.aiMessage.id, fullContent, true))
      applyFinalizedMessage({
        userMessage: finalData.userMessage,
        aiMessage: finalData.aiMessage,
        content: fullContent,
        sources: response.data.sources,
      })
    } catch (error) {
      console.error('❌ Error finalizing completed message:', error)
      dispatch(clearStreamingState(tabId))
      dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    }
  }

  const typeNextCharacter = () => {
    const state = getState()
    const streamingState = state.skripsi.streamingStateByTab[tabId]

    if (streamingState?.userStopped) {
      console.log('⏹️ User stopped - stopping typing immediately')
      isTyping = false
      return
    }

    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      if (backendSavedMessage && finalData && !finalized) {
        finalized = true
        runFinalize()
      }
      return
    }

    isTyping = true
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(updateMessageInTab({
      tabId,
      messageId: streamingMessageId,
      updates: { content: displayedContent }
    }))

    if (finalData?.aiMessage?.id) {
      dispatch(setStreamingState({
        tabId,
        realMessageId: finalData.aiMessage.id,
        realUserMessageId: finalData.userMessage ? finalData.userMessage.id : null,
        displayedContent,
        displayedLength: displayedContent.length,
        isTyping: true
      }))
    } else {
      dispatch(setStreamingState({
        tabId,
        displayedContent,
        displayedLength: displayedContent.length,
        isTyping: true
      }))
    }

    setTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  const addChunkToContent = (text) => {
    const state = getState()
    const streamingState = state.skripsi.streamingStateByTab[tabId]

    if (streamingState?.userStopped) return

    fullContent += text

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
      body: JSON.stringify({ message: content, modeType: modeType }),
      signal: abortController?.signal
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
      dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
      dispatch(clearStreamingState(tabId))
      dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
      dispatch(commonActions.setError(errorBody?.error || 'Terjadi kesalahan pada sistem'))
      return
    }

    const reader = response.body.getReader()
    const decoder = new TextDecoder()

    while (true) {
      const { value, done } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value, { stream: true })
      buffer += chunk

      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (line.startsWith('data: ')) {
          let data
          try {
            data = JSON.parse(line.slice(6))
          } catch (parseError) {
            console.error('Error parsing SSE data:', parseError)
            continue
          }

          if (data.type === 'started') {
            const { userMessage, aiMessage } = data.data
            dispatch(setStreamingState({
              tabId,
              realUserMessageId: userMessage.id,
              realMessageId: aiMessage.id,
            }))
            // Set finalData early so error path can finalize if error arrives before 'done'
            finalData = data.data
            console.log('🆔 Stored real message IDs:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })

            if (aiMessage.sources && aiMessage.sources.length > 0) {
              sources.push(...aiMessage.sources)
              showSources = true
              console.log(`📚 Received ${aiMessage.sources.length} sources from validated mode`)
            }
          } else if (data.type === 'chunk') {
            if (data.data?.userQuota?.balance !== undefined) {
              dispatch(pricingActions.updateCreditBalance(data.data.userQuota.balance))
              console.log('💎 Credit balance updated:', data.data.userQuota.balance)
            }

            const state = getState()
            const streamingState = state.skripsi.streamingStateByTab[tabId]

            if (!streamingState?.userStopped) {
              addChunkToContent(data.data.content)
            }
          } else if (data.type === 'citation') {
            sources.push({ url: data.data.url, title: data.data.title })
            console.log('📚 Citation received:', data.data.url)
          } else if (data.type === 'done') {
            backendSavedMessage = true
            finalData = data.data
            showSources = true

            if (data.data.sources?.length > 0) {
              sources.length = 0
              sources.push(...data.data.sources)
            }

            console.log('✅ Backend created streaming messages:', data.data)
            console.log('✅ Filtered citations ready to display:', sources.length)

            if (!isTyping && displayedContent.length >= fullContent.length && !finalized) {
              finalized = true
              runFinalize()
              return data.data
            }
          } else if (data.type === 'error') {
            dispatch(commonActions.setError(data.error))
            if (finalData?.aiMessage) {
              try {
                const response = await dispatch(finalizeMessage(tabId, finalData.aiMessage.id, fullContent, false))
                applyFinalizedMessage({ userMessage: finalData.userMessage, aiMessage: finalData.aiMessage, content: '', sources: response.data.sources, status: 'error' })
              } catch (saveError) {
                console.error('❌ Failed to finalize on error event:', saveError)
                dispatch(clearStreamingState(tabId))
                dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
              }
            } else {
              dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
              dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
              dispatch(clearStreamingState(tabId))
              dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
            }
            return null
          }
        }
      }
    }

  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('✅ Stream aborted by user')
      console.log('⏸️ User stopped - stopStreaming will handle finalization')
      return null
    }

    console.error('❌ Streaming error:', error)

    if (finalData?.aiMessage) {
      // DB records were created — always finalize to avoid stuck 'streaming' status
      try {
        console.log(`💾 Finalizing message on error: ${fullContent.length} characters`)
        const response = await dispatch(finalizeMessage(tabId, finalData.aiMessage.id, fullContent, false))
        applyFinalizedMessage({
          userMessage: finalData.userMessage,
          aiMessage: finalData.aiMessage,
          content: '',
          sources: response.data.sources,
          status: 'error'
        })
        console.log('✅ Message finalized on error')
      } catch (saveError) {
        console.error('❌ Failed to finalize message on error:', saveError)
        dispatch(clearStreamingState(tabId))
        dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
      }
    } else {
      dispatch(removeMessageFromTab({ tabId, messageId: optimisticUserId }))
      dispatch(removeMessageFromTab({ tabId, messageId: streamingMessageId }))
      dispatch(clearStreamingState(tabId))
      dispatch(setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    }

    dispatch(commonActions.setError(error.message || 'Terjadi kesalahan saat streaming pesan'))
    return null
  }

  // suppress unused variable warnings
  void showSources
}

// ============= Diagram Builder =============

export const generateDiagram = (tabId, diagramConfig) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isGeneratingDiagram', value: true }))

    const route = Endpoints.api.skripsi + `/tabs/${tabId}/diagrams`
    const response = await postWithToken(route, diagramConfig)

    const { data } = response.data

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

    await dispatch(fetchDiagramHistory(tabId))

    return response.data.data
  } finally {
    dispatch(setLoading({ key: 'isCreatingDiagram', value: false }))
  }
}
