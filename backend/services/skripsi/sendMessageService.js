import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { SkripsiAIService } from '#services/skripsi/ai/skripsiAIService'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import { SkripsiResearchModeV3 } from '#services/skripsi/ai/skripsiResearchModeV3'
import { SkripsiResearchV2Handler } from '#services/skripsi/handlers/skripsiResearchV2Handler'

export class SendMessageService extends BaseService {
  static async call({ tabId, userId, message, modeType = 'validated', onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    if (!message || message.trim() === '') {
      throw new ValidationError('Message cannot be empty')
    }

    // Verify ownership through the set
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId
      },
      include: {
        skripsi_set: true
      }
    })

    if (!tab || tab.skripsi_set.user_id !== userId) {
      throw new NotFoundError('Tab not found')
    }

    // Get mode from tab type (ai_researcher_1/2/3 → ai_researcher)
    const mode = this.getMode(tab.tab_type)

    // Fetch constants for access control
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'skripsi_access_type',
            `skripsi_${mode}_enabled`,
            `skripsi_${mode}_cost`
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if specific mode is enabled
    const modeEnabled = constantsMap[`skripsi_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} sedang tidak aktif`)
    }

    // Check user access based on access type
    const accessType = constantsMap.skripsi_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'
    console.log('[Skripsi Credit] accessType:', accessType, '| requiresCredits:', requiresCredits, '| requiresSubscription:', requiresSubscription)

    // For subscription_and_credits: subscribers get free access, non-subscribers need credits
    let messageCost = 0
    let hasSubscription = false

    if (requiresSubscription) {
      hasSubscription = await HasActiveSubscriptionService.call(userId)

      // If subscription_and_credits mode and user has subscription, they get free access
      if (accessType === 'subscription_and_credits' && hasSubscription) {
        // Free for subscribers, skip credit check
      } else if (!hasSubscription && accessType === 'subscription') {
        // Subscription only mode and no subscription
        throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur Skripsi Builder')
      }
    }

    // Check credits if required (and not bypassed by subscription)
    if (requiresCredits) {
      messageCost = parseFloat(constantsMap[`skripsi_${mode}_cost`]) || 0

      if (messageCost > 0) {
        // Get user's credit balance
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        if (!userCredit || userCredit.balance < messageCost) {
          throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${messageCost} kredit untuk menggunakan ${mode}`)
        }
      }
    }

    // Get AI response with streaming
    try {
      // Research mode for ai_researcher tabs → V3 (tutor) or V2 (others)
      if (modeType === 'research' && mode === 'ai_researcher' && onStream) {
        const result = await SkripsiResearchModeV3.call({
          tabId,
          userId,
          message: message.trim(),
          tabType: tab.tab_type
        })

        return await SkripsiResearchV2Handler.handle({
          tabId,
          setId: tab.set_id,
          userId,
          userMessageContent: message.trim(),
          stream: result.stream,
          sources: result.sources,
          noResults: result.noResults,
          modeType,
          messageCost,
          requiresCredits,
          onStream,
          onComplete,
          onError,
          checkClientConnected,
          streamAbortSignal
        })
      }

      const result = await SkripsiAIService.call({
        tabId,
        message: message.trim(),
        tabType: tab.tab_type,
        modeType: modeType // Pass mode type (research or validated)
      })
      console.log(result)

      // Handle streaming response
      if (onStream && result.stream) {
        // Use provider from result to determine which handler to call
        if (result.provider === "perplexity") {
          return await this.handlePerplexityStreamingResponse({
            tabId,
            setId: tab.set_id,
            userId,
            userMessageContent: message.trim(),
            modeType,
            stream: result.stream,
            messageCost,
            requiresCredits,
            onStream,
            onComplete,
            onError,
            checkClientConnected,
            streamAbortSignal
          })
        } else if (result.provider === "gemini") {
          return await this.handleStreamingResponse({
            tabId,
            setId: tab.set_id,
            userId,
            userMessageContent: message.trim(),
            modeType,
            stream: result.stream,
            sources: result.sources, // For validated mode
            messageCost,
            requiresCredits,
            onStream,
            onComplete,
            onError,
            checkClientConnected,
            streamAbortSignal
          })
        }
      }

      // Non-streaming fallback (shouldn't reach here with current implementation)
      throw new ValidationError('Streaming is required for Skripsi Builder')
    } catch (error) {
      if (onError) {
        onError(error)
        return
      }
      throw error
    }
  }

  /**
   * Get mode from tab type (ai_researcher_1/2/3 → ai_researcher)
   */
  static getMode(tabType) {
    if (tabType.startsWith('ai_researcher')) {
      return 'ai_researcher'
    }
    return tabType
  }

  /**
   * Handle streaming response from Perplexity (Research mode)
   */
  static async handlePerplexityStreamingResponse({ tabId, setId, userId, userMessageContent, modeType, stream, messageCost, requiresCredits, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let clientStillConnected = true
    let accumulatedChunk = '' // Buffer to accumulate 20 characters
    let userMessage = null
    let aiMessage = null
    const citations = []
    const sentCitations = new Set()

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    // Track if first chunk has been sent (for credit deduction)
    let isFirstChunk = true
    let newBalance = null
    let firstContentChunkReceived = false
    const NO_CITATIONS_FALLBACK = 'Maaf, tidak ada informasi yang tersedia karena tidak ditemukan referensi dari trusted domain filter yang dikonfigurasi dalam pengaturan.'

    try {
      // CREATE MESSAGE RECORDS FIRST (before streaming)
      userMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'user',
          content: userMessageContent,
          mode_type: modeType,
          status: 'completed',
          created_at: new Date()
        }
      })

      aiMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'ai',
          content: '', // Empty initially
          mode_type: modeType,
          status: 'streaming', // Mark as streaming
          created_at: new Date()
        }
      })

      // SEND MESSAGE IDs IMMEDIATELY to frontend
      try {
        onStream({
          type: 'started',
          data: {
            userMessage: {
              id: userMessage.id,
              senderType: userMessage.sender_type,
              content: userMessage.content,
              modeType: userMessage.mode_type,
              createdAt: userMessage.created_at.toISOString()
            },
            aiMessage: {
              id: aiMessage.id,
              senderType: aiMessage.sender_type,
              content: aiMessage.content,
              modeType: aiMessage.mode_type,
              createdAt: aiMessage.created_at.toISOString()
            }
          }
        })
        console.log('✅ Sent message IDs to frontend:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })
      } catch (e) {
        console.log('Could not send started event - client disconnected')
      }

      // Process Perplexity stream chunks with pacing
      for await (const chunk of stream) {
        // Check if stream was aborted BEFORE processing chunk (client disconnected)
        if (streamAbortSignal && streamAbortSignal.aborted) {
          console.log('Stream aborted - client disconnected')
          streamAborted = true
          clientStillConnected = false
          break
        }

        // Double check with function if available
        if (checkClientConnected && !checkClientConnected()) {
          console.log('Client disconnected - stopping stream processing')
          streamAborted = true
          clientStillConnected = false
          break
        }

        // Extract citations FIRST before processing content
        let foundCitations = null

        if (chunk.search_results && chunk.search_results.length > 0) {
          foundCitations = chunk.search_results
        } else if (chunk.citations && chunk.citations.length > 0) {
          foundCitations = chunk.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
        } else if (chunk.choices?.[0]?.message?.citations && chunk.choices[0].message.citations.length > 0) {
          foundCitations = chunk.choices[0].message.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
        } else if (chunk.choices?.[0]?.delta?.citations && chunk.choices[0].delta.citations.length > 0) {
          foundCitations = chunk.choices[0].delta.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
        }

        if (foundCitations && Array.isArray(foundCitations)) {
          foundCitations.forEach(citation => {
            const citationUrl = typeof citation === 'string' ? citation : citation.url
            const citationTitle = typeof citation === 'string' ? citation.substring(0, 200) : (citation.title || citation.url.substring(0, 200))
            const citationDate = typeof citation === 'string' ? null : (citation.date || null)

            if (!sentCitations.has(citationUrl)) {
              sentCitations.add(citationUrl)
              citations.push({ url: citationUrl, title: citationTitle, date: citationDate })

              try {
                onStream({ type: 'citation', data: { url: citationUrl, title: citationTitle, date: citationDate } })
                console.log('📤 Sent citation to client:', citationUrl)
              } catch (e) {
                console.log('❌ Failed to send citation:', e)
              }
            }
          })
        }

        const content = chunk.choices?.[0]?.delta?.content || ''

        if (content) {
          // First content chunk — check citations before proceeding
          if (!firstContentChunkReceived) {
            firstContentChunkReceived = true
            if (citations.length === 0) {
              console.log('⚠️  No citations before first content chunk — aborting and using fallback message')
              fullResponseFromAI = NO_CITATIONS_FALLBACK
              accumulatedChunk = NO_CITATIONS_FALLBACK
              break
            }
          }

          fullResponseFromAI += content
          accumulatedChunk += content

          // Send chunk when we have 20+ characters
          while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
            // Check abort BEFORE processing this chunk
            if (streamAbortSignal && streamAbortSignal.aborted) {
              console.log('Stream aborted - not sending accumulated chunk')
              streamAborted = true
              break
            }

            const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
            accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

            // Deduct credits on FIRST chunk
            console.log(isFirstChunk)
            console.log(requiresCredits)
            console.log(messageCost)
            if (isFirstChunk && requiresCredits && messageCost > 0) {
              const userCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })

              await prisma.user_credits.update({
                where: { user_id: userId },
                data: { balance: { decrement: messageCost } }
              })

              const updatedUserCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })
              newBalance = updatedUserCredit.balance

              await prisma.credit_transactions.create({
                data: {
                  user_id: userId,
                  user_credit_id: userCredit.id,
                  type: 'deduction',
                  amount: -messageCost,
                  balance_before: userCredit.balance,
                  balance_after: newBalance,
                  description: `Skripsi Builder - 1 pesan`,
                  payment_status: 'completed'
                }
              })
            }

            // Try to send chunk to client
            try {
              const chunkData = {
                type: 'chunk',
                data: {
                  content: chunkToSend
                }
              }

              // Include userQuota in first chunk
              if (isFirstChunk) {
                if (newBalance !== null) {
                  chunkData.data.userQuota = { balance: newBalance }
                }
                isFirstChunk = false // Always mark first chunk as sent
              }

              onStream(chunkData, () => {
                // Only add to sentContentToClient if callback fires (client still connected)
                sentContentToClient += chunkToSend
              })
            } catch (e) {
              // Client disconnected mid-chunk - don't add to sentContentToClient
              console.log('Client disconnected during chunk send - chunk not sent')
              streamAborted = true
              clientStillConnected = false
              break
            }

            // Check abort status before delay
            if (streamAbortSignal && streamAbortSignal.aborted) {
              console.log('Stream aborted during pacing delay')
              streamAborted = true
              break
            }

            // Delay for 20 chars: 20 * 10ms = 300ms
            const delay = CHARS_PER_CHUNK * TYPING_SPEED_MS
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }

        if (streamAborted) break
      }

      // Send any remaining accumulated characters
      if (accumulatedChunk.length > 0 && !streamAborted) {
        try {
          onStream({
            type: 'chunk',
            data: {
              content: accumulatedChunk
            }
          }, () => {
              sentContentToClient += accumulatedChunk
          })
        } catch (e) {
          console.log('Client disconnected during final chunk send')
          streamAborted = true
        }
      }

      // Final check: if client disconnected during streaming, mark as aborted
      if (!streamAborted && checkClientConnected && !checkClientConnected()) {
        console.log('Client disconnected - detected after stream loop')
        streamAborted = true
      }

      // Stream ended (either completed or aborted)
      // Save what we have sent to the client
      const contentToSave = streamAborted ? sentContentToClient : fullResponseFromAI

      console.log(`Stream ${streamAborted ? 'aborted' : 'completed'}.`)
      console.log(`  - Full AI response: ${fullResponseFromAI.length} chars`)
      console.log(`  - Sent to client: ${sentContentToClient.length} chars`)
      console.log(`  - Accumulated buffer: ${accumulatedChunk.length} chars`)
      console.log(`  - Content to send to frontend: ${contentToSave.length} chars`)

      // DON'T save to database yet - let frontend finalize
      // Message stays in 'streaming' status until frontend calls /finalize
      console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

      // Save sources/citations if any (send all citations, no filtering)
      const sources = []
      if (citations.length > 0) {
        // Remove duplicates based on URL
        const uniqueCitations = Array.from(
          new Map(citations.map(c => [c.url, c])).values()
        )

        // Create source objects with citation numbers
        console.log(citations)
        const allSources = uniqueCitations.map((citation, index) => ({
          sourceType: 'web_search',
          title: citation.title || citation.url.substring(0, 200),
          content: citation.url.substring(0, 500),
          url: citation.url,
          score: 1.0 - (index * 0.1)
        }))

        // Save all sources to database (no filtering)
        if (allSources.length > 0) {
          await prisma.skripsi_message_sources.createMany({
            data: allSources.map(src => ({
              message_id: aiMessage.id,
              source_type: src.sourceType,
              title: src.title,
              content: src.content,
              url: src.url,
              score: src.score
            }))
          })

          // Format all sources for response
          sources.push(...allSources)
        }
      }

      // Streaming complete - deduct credits
      try {

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          // Credits already deducted when first chunk was sent
        }

        // Update tab and set timestamps
        await prisma.skripsi_tabs.update({
          where: { id: tabId },
          data: { updated_at: new Date() }
        })

        await prisma.skripsi_sets.update({
          where: { id: setId },
          data: { updated_at: new Date() }
        })

        // Send completion with camelCase fields (like chatbot)
        onComplete({
          userMessage: {
            id: userMessage.id,
            senderType: userMessage.sender_type,
            content: userMessage.content,
            modeType: modeType,
            createdAt: userMessage.created_at.toISOString()
          },
          aiMessage: {
            id: aiMessage.id,
            senderType: aiMessage.sender_type,
            content: aiMessage.content,
            modeType: modeType,
            createdAt: aiMessage.created_at.toISOString()
          },
          sources: sources
        })
      } catch (dbError) {
        console.error('Database error after streaming:', dbError)
        if (onError) {
          onError(new Error(`Failed to save message: ${dbError.message}`))
        }
        throw dbError
      }
    } catch (error) {
      console.error('Perplexity streaming error:', error)
      if (onError) {
        onError(error)
      }
      throw error
    }
  }

  /**
   * Handle streaming response from Gemini
   */
  static async handleStreamingResponse({ tabId, setId, userId, userMessageContent, modeType, stream, sources, messageCost, requiresCredits, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let clientStillConnected = true
    let accumulatedChunk = '' // Buffer to accumulate 20 characters
    let userMessage = null
    let aiMessage = null
    let firstContentChunkReceived = false
    const NO_CITATIONS_FALLBACK = 'Maaf, tidak ada referensi yang ditemukan untuk pertanyaan ini. Silakan coba dengan pertanyaan yang berbeda.'

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    // Track if first chunk has been sent (for credit deduction)
    let isFirstChunk = true
    let newBalance = null

    try {
      // CREATE MESSAGE RECORDS FIRST (before streaming)
      userMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'user',
          content: userMessageContent,
          mode_type: modeType,
          status: 'completed',
          created_at: new Date()
        }
      })

      aiMessage = await prisma.skripsi_messages.create({
        data: {
          tab_id: tabId,
          sender_type: 'ai',
          content: '', // Empty initially
          mode_type: modeType,
          status: 'streaming', // Mark as streaming
          created_at: new Date()
        }
      })

      // Save sources if any (for validated mode)
      if (sources && sources.length > 0) {
        await prisma.skripsi_message_sources.createMany({
          data: sources.map(src => ({
            message_id: aiMessage.id,
            source_type: src.sourceType || 'summary_note',
            title: src.title,
            content: src.content || '',
            url: src.url,
            score: src.score || 0
          }))
        })
      }

      // SEND MESSAGE IDs IMMEDIATELY to frontend
      try {
        onStream({
          type: 'started',
          data: {
            userMessage: {
              id: userMessage.id,
              senderType: userMessage.sender_type,
              content: userMessage.content,
              modeType: userMessage.mode_type,
              createdAt: userMessage.created_at.toISOString()
            },
            aiMessage: {
              id: aiMessage.id,
              senderType: aiMessage.sender_type,
              content: aiMessage.content,
              modeType: aiMessage.mode_type,
              createdAt: aiMessage.created_at.toISOString(),
              sources: sources // Include sources for validated mode
            }
          }
        })
        console.log('✅ Sent message IDs to frontend:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })
      } catch (e) {
        console.log('Could not send started event - client disconnected')
      }

      // Process Gemini stream chunks with pacing
      for await (const chunk of stream) {
        // Check if stream was aborted BEFORE processing chunk (client disconnected)
        if (streamAbortSignal && streamAbortSignal.aborted) {
          console.log('Stream aborted - client disconnected')
          streamAborted = true
          clientStillConnected = false
          break
        }

        // Double check with function if available
        if (checkClientConnected && !checkClientConnected()) {
          console.log('Client disconnected - stopping stream processing')
          streamAborted = true
          clientStillConnected = false
          break
        }

        const text = chunk.text

        if (text) {
          fullResponseFromAI += text
          accumulatedChunk += text

          // Send chunk when we have 20+ characters
          while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
            const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
            accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

            // Deduct credits on FIRST chunk
            if (isFirstChunk && requiresCredits && messageCost > 0) {
              const userCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })

              await prisma.user_credits.update({
                where: { user_id: userId },
                data: { balance: { decrement: messageCost } }
              })

              const updatedUserCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })
              newBalance = updatedUserCredit.balance

              await prisma.credit_transactions.create({
                data: {
                  user_id: userId,
                  user_credit_id: userCredit.id,
                  type: 'deduction',
                  amount: -messageCost,
                  balance_before: userCredit.balance,
                  balance_after: newBalance,
                  description: `Skripsi Builder - 1 pesan`,
                  payment_status: 'completed'
                }
              })
            }

            // Try to send chunk to client
            try {
              const chunkData = {
                type: 'chunk',
                data: {
                  content: chunkToSend
                }
              }

              // Include userQuota in first chunk
              if (isFirstChunk) {
                if (newBalance !== null) {
                  chunkData.data.userQuota = { balance: newBalance }
                }
                isFirstChunk = false // Always mark first chunk as sent
              }

              onStream(chunkData, () => {
                // Only add to sentContentToClient if callback fires (client still connected)
                sentContentToClient += chunkToSend
              })
            } catch (e) {
              // Client disconnected mid-chunk - don't add to sentContentToClient
              console.log('Client disconnected during chunk send - chunk not sent')
              streamAborted = true
              clientStillConnected = false
              break
            }

            // Check abort status before delay
            if (streamAbortSignal && streamAbortSignal.aborted) {
              console.log('Stream aborted during pacing delay')
              streamAborted = true
              break
            }

            // Delay for 20 chars: 20 * 10ms = 300ms
            const delay = CHARS_PER_CHUNK * TYPING_SPEED_MS
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }

        if (streamAborted) break
      }

      // Send any remaining accumulated characters
      if (accumulatedChunk.length > 0 && !streamAborted) {
        try {
          onStream({
            type: 'chunk',
            data: {
              content: accumulatedChunk
            }
          }, () => {
            sentContentToClient += accumulatedChunk
          })
        } catch (e) {
          console.log('Client disconnected during final chunk send')
          streamAborted = true
        }
      }

      // Stream ended (either completed or aborted)
      // Save what we have sent to the client
      const contentToSave = streamAborted ? sentContentToClient : fullResponseFromAI

      console.log(`Stream ${streamAborted ? 'aborted' : 'completed'}.`)
      console.log(`  - Full AI response: ${fullResponseFromAI.length} chars`)
      console.log(`  - Sent to client: ${sentContentToClient.length} chars`)
      console.log(`  - Accumulated buffer: ${accumulatedChunk.length} chars`)
      console.log(`  - Saving: ${contentToSave.length} chars`)
      console.log(`  - chunks sent to client: ${sentContentToClient}`)
      console.log(`  - sent to client: ${contentToSave}`)
      console.log(`  - response AI: ${fullResponseFromAI}`)

      // DON'T save to database yet - let frontend finalize
      // Message stays in 'streaming' status until frontend calls /finalize
      console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

      // Streaming complete - deduct credits
      try {

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          // Credits already deducted when first chunk was sent
        }

        // Update tab and set timestamps
        await prisma.skripsi_tabs.update({
          where: { id: tabId },
          data: { updated_at: new Date() }
        })

        await prisma.skripsi_sets.update({
          where: { id: setId },
          data: { updated_at: new Date() }
        })

        // Send completion with camelCase fields (like chatbot)
        onComplete({
          userMessage: {
            id: userMessage.id,
            senderType: userMessage.sender_type,
            content: userMessage.content,
            modeType: modeType,
            createdAt: userMessage.created_at.toISOString()
          },
          aiMessage: {
            id: aiMessage.id,
            senderType: aiMessage.sender_type,
            content: aiMessage.content,
            modeType: modeType,
            createdAt: aiMessage.created_at.toISOString()
          }
        })
      } catch (dbError) {
        console.error('Database error after streaming:', dbError)
        // Even if DB operations fail, we got the AI response
        // Send error to client with the response we have
        if (onError) {
          onError(new Error(`Failed to save message: ${dbError.message}`))
        }
        throw dbError
      }
    } catch (error) {
      console.error('Streaming error:', error)
      if (onError) {
        onError(error)
      }
      throw error
    }
  }
}
