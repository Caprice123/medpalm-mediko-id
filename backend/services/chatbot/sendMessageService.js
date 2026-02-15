import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { NormalModeAIService } from '#services/chatbot/ai/normalModeAIService'
import { ValidatedSearchModeAIService } from '#services/chatbot/ai/validatedSearchModeAIService'
import { ResearchModeAIService } from '#services/chatbot/ai/researchModeAIService'
import { ResearchModeWithQueryReformulation } from '#services/chatbot/ai/researchModeWithQueryReformulation'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class SendMessageService extends BaseService {
  static async call({ userId, conversationId, message, mode, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    this.validate({ userId, conversationId, message, mode })

    // Verify conversation exists and user has access
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        unique_id: conversationId,
        is_deleted: false
      },
      select: { id: true, user_id: true }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    if (conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    // Use internal id for all database operations
    const internalConversationId = conversation.id

    const constants = await GetConstantsService.call([
        'chatbot_access_type',
        `chatbot_${mode}_enabled`,
        `chatbot_${mode}_cost`
    ])

    // Check if specific mode is enabled
    const modeEnabled = constants[`chatbot_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} sedang tidak aktif. Silakan pilih mode lain`)
    }

    // Check user access based on access type
    const accessType = constants.chatbot_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

    // Check subscription if required
    if (requiresSubscription) {
      const hasSubscription = await HasActiveSubscriptionService.call(userId)

      if (!hasSubscription) {
        throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur chatbot')
      }
    }

    // Check credits if required
    let messageCost = 0
    if (requiresCredits) {
      messageCost = parseFloat(constants[`chatbot_${mode}_cost`]) || 5

      // Get user's credit balance
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId }
      })

      if (!userCredit || userCredit.balance < messageCost) {
        throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${messageCost} kredit untuk menggunakan mode ${mode}`)
      }
    }

    // Don't save user message yet - will be saved after streaming completes

    // Get AI response based on mode
    let aiResponse
    let sources = []
    const creditsUsed = messageCost

    try {
        let result
      if (mode === 'normal') {
        result = await NormalModeAIService.call({ userId, conversationId: internalConversationId, message })
      } else if (mode === 'validated') {
        result = await ValidatedSearchModeAIService.call({ userId, conversationId: internalConversationId, message })
      } else if (mode === 'research') {
        // Use new query reformulation service for Indonesian queries with domain filter
        result = await ResearchModeWithQueryReformulation.call({ userId, conversationId: internalConversationId, message })
      }

      if (onStream && result.stream) {
        if (result.provider == "gemini") {
            return await this.handleGeminiStreamingResponse({
                userId,
                conversationId: internalConversationId,
                userMessageContent: message,
                stream: result.stream,
                creditsUsed: creditsUsed,
                sources: result.sources,
                mode,
                requiresCredits,
                onStream,
                onComplete,
                onError,
                checkClientConnected,
                streamAbortSignal
            })
        } else if (result.provider == "perplexity") {
            return await this.handlePerplexityStreamingResponse({
                userId,
                conversationId: internalConversationId,
                userMessageContent: message,
                stream: result.stream,
                creditsUsed: creditsUsed,
                mode,
                requiresCredits,
                onStream,
                onComplete,
                onError,
                checkClientConnected,
                streamAbortSignal
            })
        }
      }

      aiResponse = result.response
      sources = result.sources
    } catch (error) {
      // If AI service fails, handle error
      if (onError) {
        onError(error)
        return
      }
      aiResponse = 'Sorry, I encountered an error processing your message. Please try again.'
      console.error('AI Service Error:', error)
    }
  }

  /**
   * Handle streaming response from Gemini (Normal and Validated modes)
   */
  static async handleGeminiStreamingResponse({ userId, conversationId, userMessageContent, stream, creditsUsed, sources, mode, requiresCredits, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let clientStillConnected = true
    let accumulatedChunk = '' // Buffer to accumulate 20 characters

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    let userMessage, aiMessage

    try {
      // CREATE MESSAGE RECORDS FIRST (before streaming)
      userMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessageContent,
          status: "completed",
          credits_used: 0,
          created_at: new Date()
        }
      })

      // Update conversation's last_message (trimmed to 50 chars)
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
          content: '', // Empty initially, will be updated
          status: "streaming",
          credits_used: creditsUsed,
          created_at: new Date()
        }
      })

      // SEND MESSAGE IDs to frontend (quota will be sent when first chunk arrives)
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
                content: aiMessage.content,
                sources: sources,
                createdAt: aiMessage.created_at.toISOString()
            }
          }
        })
        console.log('✅ Sent message IDs to frontend:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })
      } catch (e) {
        console.log('Could not send started event - client disconnected')
      }
    } catch (dbError) {
      console.error('❌ Failed to create message records:', dbError)
      // Send error to frontend
      if (onError) {
        onError(new Error('Failed to create message records'))
      }
      throw dbError
    }

    // Track if first chunk has been sent (for credit deduction)
    let isFirstChunk = true
    let newBalance = null

    try {
      // Process Gemini stream chunks with pacing
      for await (const chunk of stream) {
        // Check if stream was aborted (client disconnected)
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
            if (isFirstChunk && requiresCredits && creditsUsed > 0) {
              const userCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })

              newBalance = userCredit.balance - creditsUsed

              await prisma.user_credits.update({
                where: { user_id: userId },
                data: { balance: newBalance }
              })

              await prisma.credit_transactions.create({
                data: {
                  user_id: userId,
                  user_credit_id: userCredit.id,
                  type: 'deduction',
                  amount: -creditsUsed,
                  balance_before: userCredit.balance,
                  balance_after: newBalance,
                  description: `Chatbot ${mode} mode - 1 pesan`,
                  payment_status: 'completed'
                }
              })
            }

            // Try to send chunk to client
            try {
                // Only add to sentContentToClient AFTER successfully sending
                const chunkData = {
                    type: 'chunk',
                    data: {
                        content: chunkToSend
                    }
                }

                // Include userQuota in first chunk
                if (isFirstChunk && newBalance !== null) {
                  chunkData.data.userQuota = { balance: newBalance }
                  isFirstChunk = false // Mark first chunk as sent
                }

                onStream(chunkData, () => {
                    sentContentToClient += chunkToSend
                    console.log(sentContentToClient)
                    console.log(chunkToSend)
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

            // Delay for 20 chars: 20 * 10ms * 2 = 400ms
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
      console.log(`  - Content to send to frontend: ${contentToSave.length} chars`)

      // DON'T save to database yet - let frontend finalize
      // Message stays in 'streaming' status until frontend calls /finalize
      console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

      // Save sources if any (for Validated mode)
      // Filter to only include sources that are actually cited in the response
      if (sources && sources.length > 0) {
        const filteredSources = this.filterUsedSources(contentToSave, sources)

        if (filteredSources.length > 0) {
          await prisma.chatbot_message_sources.createMany({
            data: filteredSources.map(src => ({
              message_id: aiMessage.id,
              source_type: src.sourceType,
              title: src.title,
              content: src.content,
              url: src.url,
              score: src.score
            }))
          })
        }

        // Update sources for response data
        sources = filteredSources
      }

      // Credits already deducted at the start of streaming

      // Update conversation timestamp
      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() }
      })

      // ALWAYS send completion with saved message data
      // This ensures frontend gets real IDs even when stream was aborted
      aiMessage = await prisma.chatbot_messages.findFirst({
        where: { id: aiMessage.id }
      })

      const responseData = {
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
          content: aiMessage.content,
          creditsUsed: aiMessage.credits_used,
          sources: sources || [],
          createdAt: aiMessage.created_at.toISOString()
        }
      }

      // Try to send completion event (may fail if client already disconnected)
      try {
        onComplete(responseData)
      } catch (e) {
        console.log('Could not send completion event - client already disconnected')
      }

      return responseData
    } catch (error) {
      console.error('Gemini streaming error:', error)
      if (onError) {
        try {
          onError(error)
        } catch (e) {
          console.log('Could not send error - client disconnected')
        }
      }
    }
  }

  /**
   * Handle streaming response from Perplexity (Research mode)
   */
  static async handlePerplexityStreamingResponse({ userId, conversationId, userMessageContent, stream, creditsUsed, mode, requiresCredits, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let clientStillConnected = true
    let accumulatedChunk = '' // Buffer to accumulate 20 characters
    const citations = []
    const sentCitations = new Set()
    let isInThinkTag = false // Track if we're inside <think> tags
    let buffer = '' // Buffer to detect tags across chunks

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    let userMessage, aiMessage

    try {
      // CREATE MESSAGE RECORDS FIRST (before streaming)
      userMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessageContent,
          status: "completed",
          credits_used: 0,
          created_at: new Date()
        }
      })

      // Update conversation's last_message (trimmed to 50 chars)
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
          content: '', // Empty initially, will be updated
          status: "streaming",
          credits_used: creditsUsed,
          created_at: new Date()
        }
      })

      // Deduct credits IMMEDIATELY at start of streaming
      let newBalance = null
      if (requiresCredits && creditsUsed > 0) {
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        newBalance = userCredit.balance - creditsUsed

        await prisma.user_credits.update({
          where: { user_id: userId },
          data: { balance: newBalance }
        })

        await prisma.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            type: 'deduction',
            amount: -creditsUsed,
            balance_before: userCredit.balance,
            balance_after: newBalance,
            description: `Chatbot ${mode} mode - 1 pesan`,
            payment_status: 'completed'
          }
        })
      }

      // SEND MESSAGE IDs IMMEDIATELY to frontend with updated quota
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
                content: aiMessage.content,
                sources: [],
                createdAt: aiMessage.created_at.toISOString()
            },
            userQuota: newBalance !== null ? { balance: newBalance } : null
          }
        })
        console.log('✅ Sent message IDs to frontend:', { userMessageId: userMessage.id, aiMessageId: aiMessage.id })
      } catch (e) {
        console.log('Could not send started event - client disconnected')
      }
    } catch (dbError) {
      console.error('❌ Failed to create message records:', dbError)
      // Send error to frontend
      if (onError) {
        onError(new Error('Failed to create message records'))
      }
      throw dbError
    }

    // Track if first chunk has been sent (for credit deduction)
    let isFirstChunk = true
    let newBalance = null

    try {
      // Process stream chunks with pacing
      for await (const chunk of stream) {
        // Check if stream was aborted (client disconnected)
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

        const content = chunk.choices[0]?.delta?.content || ''

        if (content) {
          fullResponseFromAI += content

          // Filter out <think> tags before accumulating
          accumulatedChunk += content

          // Send chunk when we have 20+ characters
          while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
            const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
            accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

            // Deduct credits on FIRST chunk
            if (isFirstChunk && requiresCredits && creditsUsed > 0) {
              const userCredit = await prisma.user_credits.findUnique({
                where: { user_id: userId }
              })

              newBalance = userCredit.balance - creditsUsed

              await prisma.user_credits.update({
                where: { user_id: userId },
                data: { balance: newBalance }
              })

              await prisma.credit_transactions.create({
                data: {
                  user_id: userId,
                  user_credit_id: userCredit.id,
                  type: 'deduction',
                  amount: -creditsUsed,
                  balance_before: userCredit.balance,
                  balance_after: newBalance,
                  description: `Chatbot ${mode} mode - 1 pesan`,
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
              if (isFirstChunk && newBalance !== null) {
                chunkData.data.userQuota = { balance: newBalance }
                isFirstChunk = false // Mark first chunk as sent
              }

              onStream(chunkData, () => {
                  sentContentToClient += chunkToSend
              })

              // Only add to sentContentToClient AFTER successfully sending
            } catch (e) {
                console.log(e)
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

            // Delay for 20 chars: 20 * 10ms * 2 = 400ms
            const delay = CHARS_PER_CHUNK * TYPING_SPEED_MS
            await new Promise(resolve => setTimeout(resolve, delay))
          }
        }

        if (streamAborted) break

        // Extract and send citations if available
        // Try both 'citations' (old format - array of URLs) and 'search_results' (new format - array of objects)
        console.log('=== CHUNK DEBUG ===')
        console.log('Chunk keys:', Object.keys(chunk))
        console.log('Chunk.choices[0]:', chunk.choices?.[0])
        console.log('Citations (top level):', chunk.citations)
        console.log('Search results (top level):', chunk.search_results)
        console.log('Message citations:', chunk.choices?.[0]?.message?.citations)
        console.log('Delta citations:', chunk.choices?.[0]?.delta?.citations)
        console.log('Finish reason:', chunk.choices?.[0]?.finish_reason)
        console.log('==================')

        // Check for citations in multiple possible locations
        let foundCitations = null

        // Location 1: Top-level search_results (new format)
        if (chunk.search_results && chunk.search_results.length > 0) {
          foundCitations = chunk.search_results
          console.log('✅ Found search_results at top level:', foundCitations.length)
        }
        // Location 2: Top-level citations (old format)
        else if (chunk.citations && chunk.citations.length > 0) {
          foundCitations = chunk.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
          console.log('✅ Found citations at top level:', foundCitations.length)
        }
        // Location 3: Message-level citations
        else if (chunk.choices?.[0]?.message?.citations && chunk.choices[0].message.citations.length > 0) {
          foundCitations = chunk.choices[0].message.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
          console.log('✅ Found citations in message:', foundCitations.length)
        }
        // Location 4: Delta-level citations
        else if (chunk.choices?.[0]?.delta?.citations && chunk.choices[0].delta.citations.length > 0) {
          foundCitations = chunk.choices[0].delta.citations.map(url => ({ url, title: url.substring(0, 200), date: null }))
          console.log('✅ Found citations in delta:', foundCitations.length)
        }

        // Process found citations
        if (foundCitations && Array.isArray(foundCitations)) {
          foundCitations.forEach(citation => {
            // Handle both object format {url, title, date} and string format (URL)
            const citationUrl = typeof citation === 'string' ? citation : citation.url
            const citationTitle = typeof citation === 'string' ? citation.substring(0, 200) : (citation.title || citation.url.substring(0, 200))
            const citationDate = typeof citation === 'string' ? null : (citation.date || null)

            if (!sentCitations.has(citationUrl)) {
              sentCitations.add(citationUrl)
              citations.push({
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
              } catch (e) {
                console.log('❌ Failed to send citation:', e)
              }
            }
          })
        }
      }

      // Flush any remaining buffer content (excluding incomplete tags)
      if (buffer.length > 6 && !isInThinkTag) {
        const remainingFiltered = buffer.substring(0, buffer.length - 6)
        if (remainingFiltered) {
          accumulatedChunk += remainingFiltered
        }
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
      // Save what we have sent to the client (which has <think> tags filtered out)
      const contentToSave = streamAborted ? sentContentToClient : fullResponseFromAI.replace(/<think>[\s\S]*?<\/think>/g, '')

      console.log(`Stream ${streamAborted ? 'aborted' : 'completed'}.`)
      console.log(`  - Full AI response: ${fullResponseFromAI.length} chars`)
      console.log(`  - Sent to client: ${sentContentToClient.length} chars`)
      console.log(`  - Accumulated buffer: ${accumulatedChunk.length} chars`)
      console.log(`  - Content to send to frontend: ${contentToSave.length} chars`)

      // DON'T save to database yet - let frontend finalize
      // Message stays in 'streaming' status until frontend calls /finalize
      console.log('⏸️  Not saving to DB - waiting for frontend to finalize')

      // Save sources/citations if any
      const sources = []
      if (citations.length > 0) {
        // Remove duplicates based on URL
        const uniqueCitations = Array.from(
          new Map(citations.map(c => [c.url, c])).values()
        )

        await prisma.chatbot_message_sources.createMany({
          data: uniqueCitations.slice(0, 10).map((citation, index) => ({
            message_id: aiMessage.id,
            source_type: 'web_search',
            title: citation.title || citation.url.substring(0, 200),
            content: citation.date || citation.url.substring(0, 500),
            url: citation.url,
            score: 1.0 - (index * 0.1)
          }))
        })

        // Format sources for response
        sources.push(...uniqueCitations.slice(0, 10).map((citation, index) => ({
          sourceType: 'web_search',
          title: citation.title || citation.url.substring(0, 200),
          content: citation.date || citation.url.substring(0, 500),
          url: citation.url,
          score: 1.0 - (index * 0.1)
        })))
      }

      // Credits already deducted at the start of streaming

      // Update conversation timestamp
      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() }
      })

      // ALWAYS send completion with saved message data
      // This ensures frontend gets real IDs even when stream was aborted
      const responseData = {
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
          content: aiMessage.content,
          creditsUsed: aiMessage.credits_used,
          sources: sources,
          createdAt: aiMessage.created_at.toISOString()
        }
      }

      // Try to send completion event (may fail if client already disconnected)
      try {
        onComplete(responseData)
      } catch (e) {
        console.log('Could not send completion event - client already disconnected')
      }

      return responseData
    } catch (error) {
      console.error('Streaming error:', error)
      if (onError) {
        try {
          onError(error)
        } catch (e) {
          console.log('Could not send error - client disconnected')
        }
      }
    }
  }

  /**
   * Filter sources to only include those actually cited in the response
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

  static validate({ userId, conversationId, message, mode }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId) {
      throw new ValidationError('Invalid conversation ID')
    }

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      throw new ValidationError('Message is required')
    }

    if (message.length > 5000) {
      throw new ValidationError('Message is too long (max 5000 characters)')
    }

    if (!mode || !['normal', 'validated', 'research'].includes(mode)) {
      throw new ValidationError('Invalid mode. Must be one of: normal, validated, research')
    }
  }
}
