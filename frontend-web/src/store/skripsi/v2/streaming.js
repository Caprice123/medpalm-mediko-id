import { setTimeout as setWorkerTimeout } from 'worker-timers'
import Endpoints from '@config/endpoint'
import { captureException } from '@config/sentry'
import { ensureValidToken } from '../../../config/api'
import { actions as commonActions } from '@store/common/reducer'
import { actions as pricingActions } from '@store/pricing/reducer'
import { actions } from './reducer'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

// One character per tick. `worker-timers` rather than window.setTimeout because
// browsers throttle timers in a backgrounded tab to roughly one per second,
// which would stall the animation — and so the finalize call — whenever the
// student switches tab mid-answer.
const TYPING_SPEED_MS = 1

// Reads an SSE body line by line, tolerating chunk boundaries that land in the
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

// Posts a message to one skripsi tab and plays the answer back as it arrives.
//
// Same shape as the chatbot's streamer, and for the same reasons: the backend
// streams faster than a person reads, the real database ids only arrive with
// the 'started'/'done' events, and the stream may finish before the typing does
// or vice versa — so finalizing waits for whichever is last. Finalize is what
// moves the row off status 'streaming', so every exit path must reach it.
export const streamMessage = async ({
  tabId,
  content,
  modeType,
  context,
  dispatch,
  getState,
  optimisticUserId,
  abortController,
  finalizeMessage,
}) => {
  const accessToken = await ensureValidToken()
  const route = `${API_BASE_URL}${Endpoints.api.skripsiV2}/chat/tabs/${tabId}/messages`

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

  dispatch(actions.setStreamingState({ tabId, streamingMessageId }))
  dispatch(actions.addMessage({
    tabId,
    message: { id: streamingMessageId, senderType: 'ai', modeType, content: '', sources: [], createdAt },
  }))

  const userStopped = () => Boolean(
    getState().skripsiV2.streamingStateByTab[tabId]?.userStopped
  )

  const settle = () => {
    dispatch(actions.clearStreamingState(tabId))
    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
  }

  // Swaps the placeholder pair for the real, persisted messages.
  const applyFinalized = ({ userMessage, aiMessage, content: finalText, sources: finalSources, status }) => {
    dispatch(actions.removeMessage({ tabId, messageId: optimisticUserId }))
    dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))

    if (userMessage) {
      dispatch(actions.addMessage({
        tabId,
        message: { ...userMessage, modeType: userMessage.modeType || modeType },
      }))
    }
    if (aiMessage) {
      dispatch(actions.addMessage({
        tabId,
        message: {
          ...aiMessage,
          content: finalText,
          sources: finalSources || [],
          modeType: aiMessage.modeType || modeType,
          ...(status && { status }),
        },
      }))
    }

    settle()
  }

  const runFinalize = async () => {
    try {
      const response = await dispatch(finalizeMessage(tabId, finalData.aiMessage.id, fullContent, true))

      applyFinalized({
        userMessage: finalData.userMessage,
        aiMessage: finalData.aiMessage,
        content: fullContent,
        sources: response.data?.sources || sources,
      })
    } catch (error) {
      captureException(error, { feature: 'skripsi_v2', tabId, phase: 'finalize' })
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
      tabId,
      messageId: streamingMessageId,
      updates: {
        content: displayedContent,
        // Carried through on every tick. V1 updated only `content`, so
        // citations never appeared until finalize replaced the whole message —
        // it collected them into a `sources` array and then discarded it behind
        // a `void showSources` to silence the unused-variable warning.
        sources: showSources ? sources : [],
      },
    }))

    // Mirrored into Redux so a user-initiated stop knows exactly how much text
    // was actually shown, and can persist precisely that much.
    dispatch(actions.setStreamingState({
      tabId,
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

    fullContent += text
    if (!isTyping) typeNextCharacter()
  }

  try {
    const response = await fetch(route, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
      body: JSON.stringify({ message: content, modeType, context }),
      signal: abortController?.signal,
    })

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}))
      captureException(new Error(`Skripsi V2 stream HTTP ${response.status}`), {
        feature: 'skripsi_v2',
        status: response.status,
        tabId,
        errorBody,
      })

      dispatch(actions.removeMessage({ tabId, messageId: optimisticUserId }))
      dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))
      settle()
      dispatch(commonActions.setError(errorBody?.error || 'Terjadi kesalahan pada sistem'))
      return null
    }

    for await (const event of readEvents(response)) {
      if (event.type === 'chunk') {
        // The first chunk carries the post-deduction balance, so the credit
        // counter moves the moment the answer starts.
        if (event.data?.userQuota?.balance !== undefined) {
          dispatch(pricingActions.updateCreditBalance(event.data.userQuota))
        }
        addChunk(event.data.content)
        continue
      }

      if (event.type === 'started') {
        finalData = event.data
        dispatch(actions.setStreamingState({
          tabId,
          realUserMessageId: event.data.userMessage.id,
          realMessageId: event.data.aiMessage.id,
        }))

        // Validated mode knows its sources up front: they come from the
        // student's own notes rather than being discovered while streaming.
        if (event.data.aiMessage?.sources?.length > 0) {
          sources = [...event.data.aiMessage.sources]
          showSources = true
        }
        continue
      }

      if (event.type === 'content_replace') {
        // Citations were renumbered upstream, e.g. [3] became [1]. Re-point
        // both the buffer and the already-revealed prefix at the corrected text.
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

        // Typing already caught up, so nothing else will trigger the finalize.
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
          dispatch(actions.removeMessage({ tabId, messageId: optimisticUserId }))
          dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))
          settle()
          return null
        }

        try {
          const finalizeResponse = await dispatch(
            finalizeMessage(tabId, finalData.aiMessage.id, fullContent, false)
          )
          applyFinalized({
            userMessage: finalData.userMessage,
            aiMessage: finalData.aiMessage,
            content: '',
            sources: finalizeResponse.data?.sources || [],
            status: 'error',
          })
        } catch (saveError) {
          captureException(saveError, { feature: 'skripsi_v2', tabId, phase: 'finalize_on_error_event' })
          settle()
        }
        return null
      }
    }

    dispatch(actions.setTabLoading({ tabId, key: 'isSendingMessage', value: false }))
    return finalData
  } catch (error) {
    // The user pressing stop aborts the fetch; stopStreaming owns that cleanup.
    if (error.name === 'AbortError') return null

    captureException(error, {
      feature: 'skripsi_v2',
      tabId,
      hasPartialContent: Boolean(finalData?.aiMessage),
      contentLength: fullContent.length,
    })

    // Rows already exist, so they must be finalized or they stay 'streaming'.
    if (finalData?.aiMessage) {
      try {
        const finalizeResponse = await dispatch(
          finalizeMessage(tabId, finalData.aiMessage.id, fullContent, false)
        )
        applyFinalized({
          userMessage: finalData.userMessage,
          aiMessage: finalData.aiMessage,
          content: '',
          sources: finalizeResponse.data?.sources || [],
          status: 'error',
        })
      } catch (saveError) {
        captureException(saveError, { feature: 'skripsi_v2', tabId, phase: 'finalize_on_network_error' })
        settle()
      }
    } else {
      dispatch(actions.removeMessage({ tabId, messageId: optimisticUserId }))
      dispatch(actions.removeMessage({ tabId, messageId: streamingMessageId }))
      settle()
    }

    dispatch(commonActions.setError({ message: error.message || 'Terjadi kesalahan saat streaming pesan' }))
    return null
  }
}
