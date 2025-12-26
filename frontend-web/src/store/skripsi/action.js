import { actions } from '@store/skripsi/reducer'
import Endpoints from '@config/endpoint'
import { handleApiError } from '@utils/errorUtils'
import { getWithToken, postWithToken, putWithToken, deleteWithToken } from '../../utils/requestUtils'
import { getToken } from '@utils/authToken'

const {
  setSets,
  setCurrentSet,
  setCurrentTab,
  addSet,
  updateSet,
  removeSet,
  updateSetContent,
  addMessage,
  setLoading,
  setPagination,
  setError,
  clearError
} = actions

// ============= Admin Sets Management =============

export const fetchAdminSets = (filters = {}, page = 1, perPage = 20) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetsLoading', value: true }))
    dispatch(clearError())

    const params = {
      page: page.toString(),
      perPage: perPage.toString(),
      ...filters
    }

    const response = await getWithToken(Endpoints.skripsi.admin.sets, params)

    dispatch(setSets(response.data.data || []))
    dispatch(setPagination(response.data.pagination || {}))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSetsLoading', value: false }))
  }
}

export const deleteAdminSet = (setId) => async (dispatch) => {
  try {
    dispatch(clearError())

    await deleteWithToken(Endpoints.skripsi.admin.set(setId))

    dispatch(removeSet(setId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  }
}

// ============= Sets Management =============

export const fetchSets = (page = 1, perPage = 20) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetsLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.skripsi.sets, { page, perPage })

    dispatch(setSets(response.data.data || []))
    dispatch(setPagination(response.data.pagination || {}))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSetsLoading', value: false }))
  }
}

export const createSet = (title, description) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetLoading', value: true }))
    dispatch(clearError())

    const response = await postWithToken(Endpoints.skripsi.sets, { title, description })
    const newSet = response.data.data

    dispatch(addSet(newSet))

    return newSet
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSetLoading', value: false }))
  }
}

export const fetchSet = (setId) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSetLoading', value: true }))
    dispatch(clearError())

    const response = await getWithToken(Endpoints.skripsi.set(setId))
    const set = response.data.data

    dispatch(setCurrentSet(set))
    if (set.tabs && set.tabs.length > 0) {
      dispatch(setCurrentTab(set.tabs[0]))
    }

    return set
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSetLoading', value: false }))
  }
}

export const updateSetInfo = (setId, title, description) => async (dispatch) => {
  try {
    dispatch(clearError())

    const response = await putWithToken(Endpoints.skripsi.set(setId), { title, description })
    const updatedSet = response.data.data

    dispatch(updateSet(updatedSet))

    return updatedSet
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  }
}

export const deleteSet = (setId) => async (dispatch) => {
  try {
    dispatch(clearError())

    await deleteWithToken(Endpoints.skripsi.set(setId))

    dispatch(removeSet(setId))
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  }
}

// ============= Tabs Management =============

export const switchTab = (tab) => (dispatch) => {
  dispatch(setCurrentTab(tab))
}

export const saveSetContent = (setId, editorContent) => async (dispatch) => {
  try {
    dispatch(setLoading({ key: 'isSavingContent', value: true }))
    dispatch(clearError())

    const response = await putWithToken(Endpoints.skripsi.updateSetContent(setId), { editorContent })

    dispatch(updateSetContent({ setId, editorContent }))

    return response.data
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSavingContent', value: false }))
  }
}

export const loadOlderMessages = (tabId, beforeMessageId) => async (dispatch) => {
  try {
    const response = await getWithToken(Endpoints.skripsi.tabMessages(tabId), {
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
    throw err
  }
}

export const sendMessage = (tabId, message, onStreamUpdate = null) => async (dispatch, getState) => {
  try {
    dispatch(setLoading({ key: 'isSendingMessage', value: true }))
    dispatch(clearError())

    // Use streaming for all messages
    const result = await sendMessageStreaming(tabId, message, dispatch, onStreamUpdate)
    return result
  } catch (err) {
    handleApiError(err, dispatch)
    throw err
  } finally {
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
  }
}

// Streaming message handler - character-by-character typing
const sendMessageStreaming = async (tabId, content, dispatch, onStreamUpdate = null) => {
  const token = getToken()

  if (!token) {
    throw new Error('No authentication token found')
  }

  const url = `${Endpoints.skripsi.sendMessage(tabId)}`

  const streamingMessageId = `streaming-${Date.now()}`
  const messageCreatedAt = new Date().toISOString()

  // Character-by-character streaming state
  let fullContent = ''
  let displayedContent = ''
  let isTyping = false
  let streamEnded = false
  let finalData = null

  // Typing speed (milliseconds per character)
  const TYPING_SPEED = 1

  // Define temp messages (used for cleanup even in callback mode)
  const tempUserMessage = {
    id: `temp-user-${Date.now()}`,
    sender_type: 'user',
    content: content,
    created_at: messageCreatedAt
  }

  const tempAiMessage = {
    id: streamingMessageId,
    sender_type: 'ai',
    content: '',
    created_at: messageCreatedAt
  }

  // Only add to Redux if no callback provided (for backwards compatibility)
  if (!onStreamUpdate) {
    dispatch(addMessage({ tabId, message: tempUserMessage }))
    dispatch(addMessage({ tabId, message: tempAiMessage }))
  }

  // Character-by-character display function
  const displayNextCharacter = () => {
    if (displayedContent.length >= fullContent.length) {
      isTyping = false

      if (streamEnded && finalData) {
        if (!onStreamUpdate) {
          // Remove temporary messages from Redux
          dispatch(actions.removeMessage({ tabId, messageId: tempUserMessage.id }))
          dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))

          // Add final messages to Redux (only when not using callback)
          if (finalData.userMessage) {
            dispatch(addMessage({ tabId, message: finalData.userMessage }))
          }
          if (finalData.aiMessage) {
            dispatch(addMessage({ tabId, message: finalData.aiMessage }))
          }
        }

        dispatch(setLoading({ key: 'isSendingMessage', value: false }))
      }
      return
    }

    isTyping = true
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    // Update via callback or Redux
    if (onStreamUpdate) {
      onStreamUpdate(displayedContent)
    } else {
      dispatch(actions.updateMessage({
        tabId,
        messageId: streamingMessageId,
        content: displayedContent
      }))
    }

    setTimeout(displayNextCharacter, TYPING_SPEED)
  }

  // Add chunk to full content
  const addChunkToContent = (text) => {
    fullContent += text
    if (!isTyping) {
      displayNextCharacter()
    }
  }

  let buffer = ''

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token.accessToken}`
      },
      body: JSON.stringify({ message: content })
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
            } else if (data.type === 'done') {
              streamEnded = true
              finalData = data.data

              if (!isTyping && displayedContent.length >= fullContent.length) {
                if (!onStreamUpdate) {
                  // Remove temporary messages from Redux
                  dispatch(actions.removeMessage({ tabId, messageId: tempUserMessage.id }))
                  dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))

                  // Add final messages to Redux (only when not using callback)
                  if (data.data.userMessage) {
                    dispatch(addMessage({ tabId, message: data.data.userMessage }))
                  }
                  if (data.data.aiMessage) {
                    dispatch(addMessage({ tabId, message: data.data.aiMessage }))
                  }
                }

                dispatch(setLoading({ key: 'isSendingMessage', value: false }))
              }
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
    console.error('Streaming error:', error)
    // Only remove from Redux if not using callback mode
    if (!onStreamUpdate) {
      dispatch(actions.removeMessage({ tabId, messageId: tempUserMessage.id }))
      dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))
    }
    dispatch(setLoading({ key: 'isSendingMessage', value: false }))
    throw error
  }

  // Return final data when using callback mode
  return onStreamUpdate ? finalData : null
}
