/**
 * Centralized streaming handler for all AI streaming responses
 *
 * Handles both Gemini and Perplexity stream formats with:
 * - Chunking and pacing for smooth UX
 * - Credit deduction on first chunk
 * - Client disconnect detection
 * - Citation handling (for Perplexity)
 * - Content filtering (e.g., <think> tags)
 *
 * Usage:
 * ```js
 * await StreamingHandler.handle({
 *   stream,
 *   streamType: 'gemini' | 'perplexity',
 *   userId,
 *   messageCost,
 *   creditDescription,
 *   onStream,
 *   onComplete,
 *   onError,
 *   checkClientConnected,
 *   streamAbortSignal,
 *   ...customParams
 * }, {
 *   beforeStreaming: async (ctx) => { ... },
 *   onFirstChunk: async (ctx) => { ... },
 *   contentFilter: (text, state) => text,
 *   onCitation: async (ctx) => { ... },
 *   afterStreaming: async (ctx) => { ... }
 * })
 * ```
 */

import prisma from '#prisma/client'

export class StreamingHandler {
  static CHARS_PER_CHUNK = 20
  static TYPING_SPEED_MS = 1

  /**
   * Handle streaming response from AI providers
   *
   * @param {Object} config - Base configuration
   * @param {AsyncIterable} config.stream - The stream from AI provider
   * @param {string} config.streamType - 'gemini' or 'perplexity'
   * @param {number} config.userId - User ID for credit deduction
   * @param {number} config.messageCost - Cost in credits (0 for free)
   * @param {string} config.creditDescription - Description for credit transaction
   * @param {Function} config.onStream - Callback for sending chunks to client
   * @param {Function} config.onComplete - Callback when streaming completes
   * @param {Function} config.onError - Callback for errors
   * @param {Function} config.checkClientConnected - Check if client still connected
   * @param {AbortSignal} config.streamAbortSignal - Signal for aborting stream
   * @param {Object} hooks - Lifecycle hooks
   * @param {Function} hooks.beforeStreaming - Called before streaming starts (create message records)
   * @param {Function} hooks.onFirstChunk - Called on first chunk (deduct credits, send quota)
   * @param {Function} hooks.contentFilter - Filter content before sending (e.g., remove <think> tags)
   * @param {Function} hooks.onCitation - Called when citation is received (Perplexity only)
   * @param {Function} hooks.afterStreaming - Called after streaming completes (save sources, update timestamps)
   */
  static async handle(config, hooks = {}) {
    const {
      stream,
      streamType, // 'gemini' or 'perplexity'
      userId,
      messageCost = 0,
      creditDescription,
      onStream,
      onComplete,
      onError,
      checkClientConnected,
      streamAbortSignal,
      ...customParams
    } = config

    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let accumulatedChunk = ''
    let isFirstChunk = true
    let newBalance = null

    // State for content filtering (e.g., <think> tag filtering for Perplexity)
    const filterState = {
      buffer: '',
      isInThinkTag: false
    }

    // State for citations (Perplexity)
    const citationState = {
      citations: [],
      sentCitations: new Set()
    }

    try {
      // HOOK: beforeStreaming - Create message records
      const context = {
        userId,
        messageCost,
        creditDescription,
        ...customParams
      }

      let messageRecords = null
      if (hooks.beforeStreaming) {
        messageRecords = await hooks.beforeStreaming(context)
      }

      // Create mutable state object
      const streamState = {
        stream,
        fullResponseFromAI,
        sentContentToClient,
        accumulatedChunk,
        streamAborted,
        isFirstChunk,
        newBalance,
        userId,
        messageCost,
        creditDescription,
        onStream,
        checkClientConnected,
        streamAbortSignal,
        hooks,
        context,
        messageRecords
      }

      // Process stream based on type
      if (streamType === 'gemini') {
        await this._handleGeminiStream(streamState)
      } else if (streamType === 'perplexity') {
        streamState.filterState = filterState
        streamState.citationState = citationState
        await this._handlePerplexityStream(streamState)
      } else {
        throw new Error(`Unsupported stream type: ${streamType}`)
      }

      // Extract updated values from state
      fullResponseFromAI = streamState.fullResponseFromAI
      sentContentToClient = streamState.sentContentToClient
      streamAborted = streamState.streamAborted
      messageRecords = streamState.messageRecords

      // Content to save (what was actually sent to client)
      const contentToSave = streamAborted ? sentContentToClient : fullResponseFromAI

      console.log(`Stream ${streamAborted ? 'aborted' : 'completed'}.`)
      console.log(`  - Full AI response: ${fullResponseFromAI.length} chars`)
      console.log(`  - Sent to client: ${sentContentToClient.length} chars`)

      // HOOK: afterStreaming - Save sources, update timestamps, etc.
      if (hooks.afterStreaming) {
        await hooks.afterStreaming({
          ...context,
          messageRecords,
          fullResponseFromAI,
          sentContentToClient,
          contentToSave,
          streamAborted,
          citations: citationState.citations
        })
      }

      // Send completion
      if (onComplete && messageRecords) {
        onComplete(messageRecords)
      }

      return messageRecords
    } catch (error) {
      console.error('Streaming error:', error)
      if (onError) {
        try {
          onError(error)
        } catch (e) {
          console.log('Could not send error - client disconnected')
        }
      }
      throw error
    }
  }

  /**
   * Handle Gemini-style stream (async generator with .text property)
   */
  static async _handleGeminiStream(state) {
    const {
      stream,
      onStream,
      checkClientConnected,
      streamAbortSignal,
      hooks,
      context,
      userId,
      messageCost,
      creditDescription
    } = state

    let fullResponseFromAI = state.fullResponseFromAI
    let sentContentToClient = state.sentContentToClient
    let accumulatedChunk = state.accumulatedChunk
    let streamAborted = state.streamAborted
    let isFirstChunk = state.isFirstChunk
    let newBalance = state.newBalance
    let messageRecords = state.messageRecords

    for await (const chunk of stream) {
      // Check abort conditions
      if (this._shouldAbort(streamAbortSignal, checkClientConnected)) {
        streamAborted = true
        break
      }

      const text = chunk.text

      if (text) {
        fullResponseFromAI += text
        accumulatedChunk += text

        // Send chunks when we have enough characters
        while (accumulatedChunk.length >= this.CHARS_PER_CHUNK) {
          const chunkToSend = accumulatedChunk.substring(0, this.CHARS_PER_CHUNK)
          accumulatedChunk = accumulatedChunk.substring(this.CHARS_PER_CHUNK)

          // Deduct credits on FIRST chunk
          if (isFirstChunk) {
            const result = await this._handleFirstChunk({
              userId,
              messageCost,
              creditDescription,
              hooks,
              context,
              messageRecords,
              onStream
            })
            newBalance = result.newBalance
            isFirstChunk = false
          }

          // Send chunk to client
          const sent = await this._sendChunk({
            chunkToSend,
            isFirstChunk: false, // Already handled above
            newBalance,
            onStream
          })

          if (!sent) {
            streamAborted = true
            break
          }

          sentContentToClient += chunkToSend

          // Check abort before delay
          if (this._shouldAbort(streamAbortSignal, checkClientConnected)) {
            streamAborted = true
            break
          }

          // Pacing delay
          await this._delay()
        }
      }

      if (streamAborted) break
    }

    // Send remaining accumulated characters
    if (accumulatedChunk.length > 0 && !streamAborted) {
      const sent = await this._sendChunk({
        chunkToSend: accumulatedChunk,
        isFirstChunk: false,
        newBalance,
        onStream
      })

      if (sent) {
        sentContentToClient += accumulatedChunk
      }
    }

    // Update state
    state.fullResponseFromAI = fullResponseFromAI
    state.sentContentToClient = sentContentToClient
    state.streamAborted = streamAborted
    state.messageRecords = messageRecords
  }

  /**
   * Handle Perplexity-style stream (OpenAI-compatible with citations)
   */
  static async _handlePerplexityStream(state) {
    const {
      stream,
      onStream,
      checkClientConnected,
      streamAbortSignal,
      hooks,
      context,
      userId,
      messageCost,
      creditDescription,
      filterState,
      citationState
    } = state

    let fullResponseFromAI = state.fullResponseFromAI
    let sentContentToClient = state.sentContentToClient
    let accumulatedChunk = state.accumulatedChunk
    let streamAborted = state.streamAborted
    let isFirstChunk = state.isFirstChunk
    let newBalance = state.newBalance
    let messageRecords = state.messageRecords

    for await (const chunk of stream) {
      // Check abort conditions
      if (this._shouldAbort(streamAbortSignal, checkClientConnected)) {
        streamAborted = true
        break
      }

      const content = chunk.choices?.[0]?.delta?.content || ''

      if (content) {
        fullResponseFromAI += content

        // Apply content filter (e.g., remove <think> tags)
        let filteredContent = content
        if (hooks.contentFilter) {
          filteredContent = hooks.contentFilter(content, filterState)
        }

        accumulatedChunk += filteredContent

        // Send chunks when we have enough characters
        while (accumulatedChunk.length >= this.CHARS_PER_CHUNK) {
          const chunkToSend = accumulatedChunk.substring(0, this.CHARS_PER_CHUNK)
          accumulatedChunk = accumulatedChunk.substring(this.CHARS_PER_CHUNK)

          // Deduct credits on FIRST chunk
          if (isFirstChunk) {
            const result = await this._handleFirstChunk({
              userId,
              messageCost,
              creditDescription,
              hooks,
              context,
              messageRecords,
              onStream
            })
            newBalance = result.newBalance
            isFirstChunk = false
          }

          // Send chunk to client
          const sent = await this._sendChunk({
            chunkToSend,
            isFirstChunk: false,
            newBalance,
            onStream
          })

          if (!sent) {
            streamAborted = true
            break
          }

          sentContentToClient += chunkToSend

          // Check abort before delay
          if (this._shouldAbort(streamAbortSignal, checkClientConnected)) {
            streamAborted = true
            break
          }

          // Pacing delay
          await this._delay()
        }
      }

      if (streamAborted) break

      // Handle citations (Perplexity)
      await this._handleCitations({
        chunk,
        citationState,
        hooks,
        context,
        messageRecords,
        onStream
      })
    }

    // Flush remaining buffer content (excluding incomplete tags)
    if (hooks.contentFilter && filterState.buffer.length > 6 && !filterState.isInThinkTag) {
      const remainingFiltered = filterState.buffer.substring(0, filterState.buffer.length - 6)
      if (remainingFiltered) {
        accumulatedChunk += remainingFiltered
      }
    }

    // Send remaining accumulated characters
    if (accumulatedChunk.length > 0 && !streamAborted) {
      const sent = await this._sendChunk({
        chunkToSend: accumulatedChunk,
        isFirstChunk: false,
        newBalance,
        onStream
      })

      if (sent) {
        sentContentToClient += accumulatedChunk
      }
    }

    // Update state
    state.fullResponseFromAI = fullResponseFromAI
    state.sentContentToClient = sentContentToClient
    state.streamAborted = streamAborted
    state.messageRecords = messageRecords
  }

  /**
   * Check if stream should be aborted
   */
  static _shouldAbort(streamAbortSignal, checkClientConnected) {
    if (streamAbortSignal && streamAbortSignal.aborted) {
      console.log('Stream aborted - client disconnected')
      return true
    }

    if (checkClientConnected && !checkClientConnected()) {
      console.log('Client disconnected - stopping stream processing')
      return true
    }

    return false
  }

  /**
   * Handle first chunk (credit deduction, send quota)
   */
  static async _handleFirstChunk({ userId, messageCost, creditDescription, hooks, context, messageRecords, onStream }) {
    let newBalance = null

    if (messageCost > 0) {
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId }
      })

      newBalance = userCredit.balance - messageCost

      await prisma.user_credits.update({
        where: { user_id: userId },
        data: { balance: newBalance }
      })

      await prisma.credit_transactions.create({
        data: {
          user_id: userId,
          user_credit_id: userCredit.id,
          type: 'deduction',
          amount: -messageCost,
          balance_before: userCredit.balance,
          balance_after: newBalance,
          description: creditDescription,
          payment_status: 'completed'
        }
      })
    }

    // HOOK: onFirstChunk
    if (hooks.onFirstChunk) {
      await hooks.onFirstChunk({
        ...context,
        messageRecords,
        newBalance,
        onStream
      })
    }

    return { newBalance }
  }

  /**
   * Send chunk to client
   */
  static async _sendChunk({ chunkToSend, isFirstChunk, newBalance, onStream }) {
    try {
      const chunkData = {
        type: 'chunk',
        data: {
          content: chunkToSend
        }
      }

      // Include userQuota in first chunk
      if (isFirstChunk && newBalance !== null) {
        chunkData.data.userQuota = { balance: newBalance }
      }

      onStream(chunkData)
      return true
    } catch (e) {
      console.log('Client disconnected during chunk send')
      return false
    }
  }

  /**
   * Handle citations from Perplexity stream
   */
  static async _handleCitations({ chunk, citationState, hooks, context, messageRecords, onStream }) {
    if (!hooks.onCitation) return

    // Check for citations in multiple possible locations
    let foundCitations = null

    // Location 1: Top-level search_results (new format)
    if (chunk.search_results && chunk.search_results.length > 0) {
      foundCitations = chunk.search_results
    }
    // Location 2: Top-level citations (old format)
    else if (chunk.citations && chunk.citations.length > 0) {
      foundCitations = chunk.citations.map(url => ({
        url,
        title: url.substring(0, 200),
        date: null
      }))
    }
    // Location 3: Message-level citations
    else if (chunk.choices?.[0]?.message?.citations && chunk.choices[0].message.citations.length > 0) {
      foundCitations = chunk.choices[0].message.citations.map(url => ({
        url,
        title: url.substring(0, 200),
        date: null
      }))
    }
    // Location 4: Delta-level citations
    else if (chunk.choices?.[0]?.delta?.citations && chunk.choices[0].delta.citations.length > 0) {
      foundCitations = chunk.choices[0].delta.citations.map(url => ({
        url,
        title: url.substring(0, 200),
        date: null
      }))
    }

    // Process found citations
    if (foundCitations && Array.isArray(foundCitations)) {
      for (const citation of foundCitations) {
        // Handle both object format {url, title, date} and string format (URL)
        const citationUrl = typeof citation === 'string' ? citation : citation.url
        const citationTitle = typeof citation === 'string'
          ? citation.substring(0, 200)
          : (citation.title || citation.url.substring(0, 200))
        const citationDate = typeof citation === 'string' ? null : (citation.date || null)

        if (!citationState.sentCitations.has(citationUrl)) {
          citationState.sentCitations.add(citationUrl)
          citationState.citations.push({
            url: citationUrl,
            title: citationTitle,
            date: citationDate
          })

          // Send citation to client immediately
          try {
            onStream({
              type: 'citation',
              data: {
                url: citationUrl,
                title: citationTitle,
                date: citationDate
              }
            })
            console.log('📤 Sent citation to client:', citationUrl)

            // HOOK: onCitation
            await hooks.onCitation({
              ...context,
              messageRecords,
              citation: {
                url: citationUrl,
                title: citationTitle,
                date: citationDate
              }
            })
          } catch (e) {
            console.log('❌ Failed to send citation:', e)
          }
        }
      }
    }
  }

  /**
   * Delay for pacing
   */
  static async _delay() {
    const delay = this.CHARS_PER_CHUNK * this.TYPING_SPEED_MS
    await new Promise(resolve => setTimeout(resolve, delay))
  }

  /**
   * Helper: Filter <think> tags from Perplexity content
   */
  static filterThinkTags(text, state) {
    state.buffer += text
    let filteredText = ''

    while (state.buffer.length > 0) {
      if (state.isInThinkTag) {
        // We're inside a <think> tag, look for </think>
        const closeTagIndex = state.buffer.indexOf('</think>')
        if (closeTagIndex !== -1) {
          // Found closing tag, skip everything up to and including it
          state.buffer = state.buffer.substring(closeTagIndex + 8) // 8 = '</think>'.length
          state.isInThinkTag = false
        } else {
          // Haven't found closing tag yet, discard entire buffer
          state.buffer = ''
          break
        }
      } else {
        // We're outside a <think> tag, look for <think>
        const openTagIndex = state.buffer.indexOf('<think>')
        if (openTagIndex !== -1) {
          // Found opening tag, keep everything before it
          filteredText += state.buffer.substring(0, openTagIndex)
          state.buffer = state.buffer.substring(openTagIndex + 7) // 7 = '<think>'.length
          state.isInThinkTag = true
        } else {
          // No opening tag found
          // Keep all but last 6 chars (in case '<think' is split across chunks)
          if (state.buffer.length > 6) {
            filteredText += state.buffer.substring(0, state.buffer.length - 6)
            state.buffer = state.buffer.substring(state.buffer.length - 6)
          }
          break
        }
      }
    }

    return filteredText
  }

  /**
   * Helper: Filter sources to only include those actually cited in the response
   * @param {string} content - The AI response content
   * @param {Array} sources - All available sources from RAG
   * @returns {Array} Filtered sources that were actually used
   */
  static filterUsedSources(content, sources) {
    if (!content || !sources || sources.length === 0) {
      return []
    }

    // Extract all citation numbers from content (e.g., [1], [2], [3])
    const citationMatches = content.match(/\[(\d+)\]/g)
    if (!citationMatches) {
      return []
    }

    // Get unique citation numbers (convert "[1]" to 1)
    const usedCitationNumbers = [...new Set(
      citationMatches.map(match => parseInt(match.match(/\d+/)[0]))
    )]

    console.log('Used citations:', usedCitationNumbers)
    console.log('Total sources available:', sources.length)

    // Filter sources based on used citation numbers
    // Citation [1] maps to sources[0], [2] to sources[1], etc.
    const filteredSources = usedCitationNumbers
      .map(citationNum => {
        const sourceIndex = citationNum - 1 // [1] = index 0
        return sources[sourceIndex]
      })
      .filter(source => source !== undefined)

    console.log('Filtered sources count:', filteredSources.length)

    return filteredSources
  }
}
