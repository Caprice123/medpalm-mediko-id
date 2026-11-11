import { setTimeout as setWorkerTimeout } from 'worker-timers'
import Endpoints from '@config/endpoint'
import { captureException } from '@config/sentry'
import { ensureValidToken } from '../../../config/api'
import { actions as commonActions } from '@store/common/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import { actions } from './reducer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// One character per tick. `worker-timers` rather than window.setTimeout because
// browsers throttle timers in a backgrounded tab to roughly one per second, which
// would stall the animation — and therefore the finalize call — whenever the
// student switches tab mid-answer.
const TYPING_SPEED_MS = 1

// The model sometimes emits its own reasoning in <think> blocks; those are never
// shown to the student.
const stripThinking = (text) => text
  .replace(/<think>[\s\S]*?<\/think>/gi, '')
  .replace(/<\/?think>/gi, '')

// Reads an SSE body line by line, tolerating chunk boundaries that fall in the
// middle of a line.
async function* readEvents(response) {
  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { value, done } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      try {
        yield JSON.parse(line.slice(6))
      } catch {
        // A malformed frame is not worth failing the whole answer over.
      }
    }
  }
}

// Posts a message and plays the answer back as it arrives.
//
// The backend streams faster than a person reads, so text is buffered into
// `fullContent` and revealed one character at a time. Three facts make the rest
// of this readable:
//   - the real database ids only arrive with the 'started'/'done' events, so
//     until then the UI carries placeholder messages;
//   - the stream may finish before the typing does, or the other way round, so
//     finalizing waits for whichever is last;
//   - finalize is what moves the row off status 'streaming'. Every exit path —
//     completion, user stop, error event, network failure — must reach it, or
//     the message stays 'streaming' in the database forever.
export const streamMessage = async ({
  conversationId,
  content,
  mode,
  dispatch,
  getState,
  optimisticUserId,
  abortController,
  finalizeMessage,
}) => {
  const accessToken = await ensureValidToken()
  const route = `${API_BASE_URL}${Endpoints.api.chatbotV2}/conversations/${conversationId}/send`

  const streamingMessageId = `streaming-${Date.now()}`
  const createdAt = new Date().toISOString()

  let fullContent = ''
  let displayedContent = ''
  let sources = []
  let showSources = false
  let isTyping = false
  let backendSaved = false
  let finalData = null
  let finalized = false

  dispatch(actions.setStreamingState({ conversationId, streamingMessageId }))
  dispatch(actions.addMessage({
    conversationId,
    message: { id: streamingMessageId, senderType: 'ai', modeType: mode, content: '', sources: [], createdAt },
  }))

  const userStopped = () => Boolean(
    getState().chatbotV2.streamingStateByConversation[conversationId]?.userStopped
  )

  const settle = () => {
    dispatch(actions.clearStreamingState(conversationId))
    dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
  }

  // Swaps the placeholder pair for the real, persisted messages.
  const applyFinalized = ({ userMessage, aiMessage, content: finalText, sources: finalSources, status }) => {
    dispatch(actions.removeMessage({ conversationId, messageId: optimisticUserId }))
    dispatch(actions.removeMessage({ conversationId, messageId: streamingMessageId }))

    if (userMessage) {
      dispatch(actions.addMessage({ conversationId, message: userMessage }))
    }
    if (aiMessage) {
      dispatch(actions.addMessage({
        conversationId,
        message: { ...aiMessage, content: finalText, sources: finalSources || [], ...(status && { status }) },
      }))
    }

    settle()
  }

  const runFinalize = async () => {
    try {
      const response = await dispatch(
        finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, true)
      )

      applyFinalized({
        userMessage: finalData.userMessage,
        aiMessage: finalData.aiMessage,
        content: fullContent,
        sources: response.data?.sources || sources,
      })

      // Keep the thread's preview line in the list in step with what was just said.
      const conversation = getState().chatbotV2.conversations.find(c => c.uniqueId === conversationId)
      if (conversation) {
        dispatch(actions.updateConversation({
          uniqueId: conversationId,
          lastMessage: fullContent.substring(0, 50),
          updatedAt: new Date().toISOString(),
        }))
      }
    } catch (error) {
      captureException(error, { feature: 'chatbot_v2', conversationId, phase: 'finalize' })
      settle()
    }
  }

  const typeNextCharacter = () => {
    if (userStopped()) {
      isTyping = false
      return
    }

    if (displayedContent.length >= fullContent.length) {
      isTyping = false
      if (backendSaved && finalData && !finalized) {
        finalized = true
        runFinalize()
      }
      return
    }

    isTyping = true
    displayedContent = fullContent.substring(0, displayedContent.length + 1)

    dispatch(actions.updateMessage({
      conversationId,
      messageId: streamingMessageId,
      updates: {
        senderType: 'ai',
        modeType: mode,
        content: displayedContent,
        // Citations are only trustworthy once the backend has filtered and
        // renumbered them, which happens at 'done'.
        sources: showSources ? sources : [],
        createdAt,
      },
    }))

    // Mirrored into Redux so a user-initiated stop knows exactly how much text
    // was actually shown, and can persist precisely that much.
    dispatch(actions.setStreamingState({
      conversationId,
      displayedContent,
      displayedLength: displayedContent.length,
      isTyping: true,
      ...(finalData?.aiMessage?.id && {
        realMessageId: finalData.aiMessage.id,
        realUserMessageId: finalData.userMessage?.id ?? null,
      }),
    }))

    setWorkerTimeout(typeNextCharacter, TYPING_SPEED_MS)
  }

  const addChunk = (text) => {
    if (userStopped()) return

    fullContent += stripThinking(text)
    if (!isTyping) typeNextCharacter()
  }

  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ message: content, mode }),
      signal: abortController?.signal,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      captureException(new Error(`Chatbot V2 stream HTTP ${response.status}`), {
        feature: 'chatbot_v2',
        status: response.status,
        conversationId,
        errorBody,
      })

      dispatch(actions.removeMessage({ conversationId, messageId: optimisticUserId }))
      dispatch(actions.removeMessage({ conversationId, messageId: streamingMessageId }))
      settle()
      dispatch(commonActions.setError(errorBody?.error || 'Terjadi kesalahan pada sistem'))
      return null
    }

    for await (const event of readEvents(response)) {
      if (event.type === 'chunk') {
        // The first chunk carries the post-deduction balance, so the credit
        // counter in the header moves the moment the answer starts.
        if (event.data.userQuota?.balance !== undefined) {
          dispatch(pricingActions.updateCreditBalance(event.data.userQuota))
        }
        addChunk(event.data.content)
        continue
      }

      if (event.type === 'started') {
        finalData = event.data
        dispatch(actions.setStreamingState({
          conversationId,
          realUserMessageId: event.data.userMessage.id,
          realMessageId: event.data.aiMessage.id,
        }))
        continue
      }

      if (event.type === 'content_replace') {
        // Citations were renumbered upstream, e.g. [3] became [1]. Re-point both
        // the buffer and the already-revealed prefix at the corrected text.
        fullContent = event.data.content
        if (displayedContent.length > 0) {
          displayedContent = fullContent.substring(0, displayedContent.length)
        }
        continue
      }

      if (event.type === 'citation') {
        sources.push({ url: event.data.url, title: event.data.title })
        continue
      }

      if (event.type === 'done') {
        backendSaved = true
        finalData = event.data
        showSources = true

        if (event.data.sources?.length > 0) {
          sources = [...event.data.sources]
        }

        if (event.data.aiMessage?.id) {
          dispatch(actions.setStreamingState({
            conversationId,
            realMessageId: event.data.aiMessage.id,
            realUserMessageId: event.data.userMessage?.id ?? null,
            displayedContent,
            displayedLength: displayedContent.length,
          }))
        }

        // Typing already caught up, so nothing else is going to trigger finalize.
        if (!isTyping && displayedContent.length >= fullContent.length && !finalized) {
          finalized = true
          await runFinalize()
          return event.data
        }
        continue
      }

      if (event.type === 'error') {
        dispatch(commonActions.setError(event.error))

        if (!finalData?.aiMessage) {
          dispatch(actions.removeMessage({ conversationId, messageId: optimisticUserId }))
          dispatch(actions.removeMessage({ conversationId, messageId: streamingMessageId }))
          settle()
          return null
        }

        try {
          const finalizeResponse = await dispatch(
            finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, false)
          )
          applyFinalized({
            userMessage: finalData.userMessage,
            aiMessage: finalData.aiMessage,
            content: '',
            sources: finalizeResponse.data?.sources || [],
            status: 'error',
          })
        } catch (saveError) {
          captureException(saveError, { feature: 'chatbot_v2', conversationId, phase: 'finalize_on_error_event' })
          settle()
        }
        return null
      }
    }

    dispatch(actions.setLoading({ key: 'isSendingMessage', value: false }))
    return finalData
  } catch (error) {
    // The user pressing stop aborts the fetch; stopStreaming owns that cleanup.
    if (error.name === 'AbortError') return null

    captureException(error, {
      feature: 'chatbot_v2',
      conversationId,
      hasPartialContent: Boolean(finalData?.aiMessage),
      contentLength: fullContent.length,
    })

    // Rows already exist, so they must be finalized or they stay 'streaming'.
    if (finalData?.aiMessage) {
      try {
        await dispatch(finalizeMessage(conversationId, finalData.aiMessage.id, fullContent, false))
        applyFinalized({
          userMessage: finalData.userMessage,
          aiMessage: finalData.aiMessage,
          content: '',
          sources: [],
          status: 'error',
        })
      } catch (saveError) {
        captureException(saveError, { feature: 'chatbot_v2', conversationId, phase: 'finalize_on_network_error' })
        settle()
      }
    } else {
      dispatch(actions.removeMessage({ conversationId, messageId: optimisticUserId }))
      dispatch(actions.removeMessage({ conversationId, messageId: streamingMessageId }))
      settle()
    }

    dispatch(commonActions.setError({ message: error.message || 'Terjadi kesalahan saat streaming pesan' }))
    return null
  }
}
