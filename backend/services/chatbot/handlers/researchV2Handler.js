import prisma from '#prisma/client'
import { deductUserCredits, getCreditBreakdown } from '#utils/creditUtils'

const CHARS_PER_CHUNK = 20
const TYPING_SPEED_MS = 1

const NO_RESULTS_FALLBACK = 'Maaf, tidak ada informasi yang tersedia. Tidak ditemukan referensi yang relevan dari domain yang dikonfigurasi dalam pengaturan penelitian.'

/**
 * Handler for Research Mode V2 streaming responses.
 *
 * Differences from the generic Gemini handler:
 * - Sources are known BEFORE streaming starts (pre-fetched from Perplexity Stage 2)
 * - Sources sent to frontend immediately in the `started` event
 * - After streaming, filterUsedSources() strips citations not referenced in the answer
 * - Handles the noResults case (Perplexity returned nothing) with an immediate fallback
 */
export class ResearchV2Handler {
  static async handle({
    userId,
    conversationId,
    userMessageContent,
    stream,
    sources,
    noResults,
    creditsUsed,
    mode,
    requiresCredits,
    onStream,
    onComplete,
    onError,
    checkClientConnected,
    streamAbortSignal
  }) {
    // ── Create DB records first ───────────────────────────────────────────────
    let userMessage, aiMessage

    try {
      userMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessageContent,
          status: 'completed',
          credits_used: 0,
          created_at: new Date()
        }
      })

      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: {
          last_message: userMessageContent.substring(0, 50),
          updated_at: new Date()
        }
      })

      aiMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'ai',
          mode_type: mode,
          content: '',
          status: 'streaming',
          credits_used: creditsUsed,
          created_at: new Date()
        }
      })
    } catch (dbError) {
      console.error('[ResearchV2Handler] Failed to create message records:', dbError)
      if (onError) onError(new Error('Failed to create message records'))
      throw dbError
    }

    // ── Handle no-results case immediately ───────────────────────────────────
    if (noResults || !stream) {
      // Deduct credits even when no sources found
      let updatedBalance = null
      let noResultsBreakdown = null
      if (requiresCredits && creditsUsed > 0) {
        try {
          const result = await prisma.$transaction(tx => deductUserCredits(tx, userId, creditsUsed, `Chatbot ${mode} mode - 1 pesan (no results)`))
          updatedBalance = result.newBalance
          noResultsBreakdown = await getCreditBreakdown(userId)
        } catch (creditError) {
          console.error('[ResearchV2Handler] Credit deduction error on no-results:', creditError)
        }
      }

      try {
        onStream({
          type: 'started',
          data: {
            userMessage: {
              id: userMessage.id,
              senderType: userMessage.sender_type,
              content: userMessage.content,
              createdAt: userMessage.created_at.toISOString()
            },
            aiMessage: {
              id: aiMessage.id,
              senderType: aiMessage.sender_type,
              modeType: aiMessage.mode_type,
              content: '',
              sources: [],
              createdAt: aiMessage.created_at.toISOString()
            }
          }
        })

        const chunkData = { type: 'chunk', data: { content: NO_RESULTS_FALLBACK } }
        if (updatedBalance !== null) chunkData.data.userQuota = {
          balance: updatedBalance,
          permanentBalance: noResultsBreakdown?.permanentBalance ?? updatedBalance,
          expiringBuckets: noResultsBreakdown?.expiringBuckets ?? []
        }
        onStream(chunkData)
      } catch (_) {}

      const responseData = this.buildResponseData(userMessage, aiMessage, [])
      try { onComplete(responseData) } catch (_) {}
      return responseData
    }

    // ── Send started event with pre-fetched sources ───────────────────────────
    try {
      onStream({
        type: 'started',
        data: {
          userMessage: {
            id: userMessage.id,
            senderType: userMessage.sender_type,
            content: userMessage.content,
            createdAt: userMessage.created_at.toISOString()
          },
          aiMessage: {
            id: aiMessage.id,
            senderType: aiMessage.sender_type,
            modeType: aiMessage.mode_type,
            content: '',
            sources,
            createdAt: aiMessage.created_at.toISOString()
          }
        }
      })
    } catch (_) {
      console.log('[ResearchV2Handler] Could not send started event - client disconnected')
    }

    // ── Stream Gemini response ────────────────────────────────────────────────
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let accumulatedChunk = ''
    let streamAborted = false
    let isFirstChunk = true
    let updatedBalance = null
    let creditBreakdown = null

    try {
      for await (const chunk of stream) {
        if (streamAbortSignal?.aborted || (checkClientConnected && !checkClientConnected())) {
          streamAborted = true
          break
        }

        const text = chunk.text
        if (!text) continue

        fullResponseFromAI += text
        accumulatedChunk += text

        while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
          const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
          accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

          // Deduct credits on first chunk
          if (isFirstChunk && requiresCredits && creditsUsed > 0) {
            const result = await prisma.$transaction(tx => deductUserCredits(tx, userId, creditsUsed, `Chatbot ${mode} mode - 1 pesan`))
            updatedBalance = result.newBalance
            creditBreakdown = await getCreditBreakdown(userId)
          }

          try {
            const chunkData = { type: 'chunk', data: { content: chunkToSend } }
            if (isFirstChunk && updatedBalance !== null) {
              chunkData.data.userQuota = {
                balance: updatedBalance,
                permanentBalance: creditBreakdown?.permanentBalance ?? updatedBalance,
                expiringBuckets: creditBreakdown?.expiringBuckets ?? []
              }
              isFirstChunk = false
            }

            onStream(chunkData, () => { sentContentToClient += chunkToSend })
          } catch (_) {
            streamAborted = true
            break
          }

          if (streamAbortSignal?.aborted) { streamAborted = true; break }
          await new Promise(resolve => setTimeout(resolve, CHARS_PER_CHUNK * TYPING_SPEED_MS))
        }

        if (streamAborted) break
      }

      // Send remaining buffer
      if (accumulatedChunk.length > 0 && !streamAborted) {
        try {
          onStream(
            { type: 'chunk', data: { content: accumulatedChunk } },
            () => { sentContentToClient += accumulatedChunk }
          )
        } catch (_) { streamAborted = true }
      }

      const rawContent = streamAborted ? sentContentToClient : fullResponseFromAI
      const contentToSave = this.normalizeCitations(rawContent)

      // ── Filter sources + re-number citations sequentially ─────────────────
      // e.g. Gemini cited [3] from 5 Perplexity results → becomes [1] after filtering
      const { filteredSources, renumberedContent } = this.filterAndRenumberSources(contentToSave, sources)

      // Save only used sources to DB
      if (filteredSources.length > 0) {
        await prisma.chatbot_message_sources.createMany({
          data: filteredSources.map(s => ({
            message_id: aiMessage.id,
            source_type: s.sourceType,
            title: s.title,
            content: s.content,
            url: s.url,
            score: s.score
          }))
        })
      }

      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() }
      })

      // If citations were remapped, tell frontend to replace displayed content
      if (renumberedContent !== contentToSave) {
        try {
          onStream({ type: 'content_replace', data: { content: renumberedContent } })
        } catch (_) {}
      }

      // Pass re-numbered content in response so finalize saves the correct version
      const responseData = this.buildResponseData(userMessage, aiMessage, filteredSources, renumberedContent)

      try { onComplete(responseData) } catch (_) {}
      return responseData

    } catch (error) {
      console.error('[ResearchV2Handler] Streaming error:', error)
      try { if (onError) onError(error) } catch (_) {}
    }
  }

  /**
   * Normalize citation format: [1, 2] or [1,2] → [1] [2]
   */
  static normalizeCitations(content) {
    if (!content) return content
    return content.replace(/\[(\d+(?:,\s*\d+)+)\]/g, (match, inner) => {
      return inner.split(',').map(n => `[${n.trim()}]`).join(' ')
    })
  }

  /**
   * Filter sources to only those cited in Gemini's response, then re-number
   * citations sequentially so text and sources list always stay in sync.
   *
   * Example:
   *   Gemini cites [3] from 5 Perplexity results
   *   → filteredSources = [sources[2]]  (1 item)
   *   → renumberedContent: "[3]" → "[1]"
   *   → frontend shows [1] in both text and sources list ✓
   *
   * @returns {{ filteredSources: Array, renumberedContent: string }}
   */
  static filterAndRenumberSources(content, sources) {
    if (!content || !sources?.length) {
      return { filteredSources: [], renumberedContent: content }
    }

    const citationMatches = content.match(/\[(\d+)\]/g)
    if (!citationMatches) {
      return { filteredSources: [], renumberedContent: content }
    }

    // Unique citation numbers in order of first appearance
    const usedNumbers = [...new Set(citationMatches.map(m => parseInt(m.match(/\d+/)[0])))]

    // Map old citation number → source (skip invalid indices)
    const filteredSources = []
    const oldToNew = {}

    for (const oldNum of usedNumbers) {
      const source = sources[oldNum - 1]
      if (source) {
        filteredSources.push(source)
        oldToNew[oldNum] = filteredSources.length // new sequential number
      }
    }

    // Replace all [N] in content with the new sequential numbers
    const renumberedContent = content.replace(/\[(\d+)\]/g, (match, num) => {
      const newNum = oldToNew[parseInt(num)]
      return newNum !== undefined ? `[${newNum}]` : match
    })

    console.log(`[ResearchV2Handler] Citations remapped: ${JSON.stringify(oldToNew)} — ${filteredSources.length} sources kept`)

    return { filteredSources, renumberedContent }
  }

  static buildResponseData(userMessage, aiMessage, sources, renumberedContent = null) {
    return {
      userMessage: {
        id: userMessage.id,
        senderType: userMessage.sender_type,
        content: userMessage.content,
        createdAt: userMessage.created_at.toISOString()
      },
      aiMessage: {
        id: aiMessage.id,
        senderType: aiMessage.sender_type,
        modeType: aiMessage.mode_type,
        content: renumberedContent ?? aiMessage.content,
        creditsUsed: aiMessage.credits_used,
        sources,
        createdAt: aiMessage.created_at.toISOString()
      }
    }
  }
}
