import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { ValidationError } from '#errors/validationError'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'
import { deductUserCredits, getEffectiveCreditBalance, getCreditBreakdown } from '#utils/creditUtils'

export class SendOsceMessageService extends BaseService {
  static async call({
    userId,
    sessionId,
    message,
    onStream,
    onComplete,
    onError,
    checkClientConnected,
    streamAbortSignal
  }) {
    try {
      // Validate inputs
      if (!userId) throw new ValidationError('User ID is required')
      if (!sessionId) throw new ValidationError('Session ID is required')
      if (!message || !message.trim()) throw new ValidationError('Message is required')

      // Get OSCE configuration from constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'osce_practice_access_type',
              'osce_practice_credit_cost',
              'osce_practice_chat_completion_prompt',
              'osce_practice_context_message_count'
            ],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => {
        constantsMap[c.key] = c.value
      })

      const contextMessageCount = parseInt(constantsMap.osce_practice_context_message_count) || 50

      // Fetch session with topic details
      const session = await prisma.osce_sessions.findFirst({
        where: {
          unique_id: sessionId,
          user_id: userId,
        },
        include: {
          osce_topic: {
            select: {
              id: true,
              title: true,
              scenario: true,
              context: true,
              knowledge_base: true,
              ai_model: true,
            },
          },
          osce_session_messages: {
            orderBy: {
              id: 'desc',
            },
            take: contextMessageCount, // Last N messages for context (configurable)
          },
        },
      })

      if (!session) {
        throw new ValidationError('Session not found or access denied')
      }

      // Check user access based on access type
      const accessType = constantsMap.osce_practice_access_type || 'subscription'
      const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
      const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

      if (requiresSubscription) {
        const hasSubscription = await HasActiveSubscriptionService.call(userId)
        if (!hasSubscription) {
          throw new ValidationError('Anda memerlukan langganan aktif untuk menggunakan fitur OSCE Practice')
        }
      }

      let messageCost = 0
      if (requiresCredits) {
        messageCost = parseFloat(constantsMap.osce_practice_credit_cost) || 0

        if (messageCost > 0) {
          const balance = await getEffectiveCreditBalance(userId)

          if (balance < messageCost) {
            throw new ValidationError(`Kredit tidak cukup. Anda memerlukan ${messageCost} kredit untuk mengirim pesan`)
          }
        }
      }

      // Build system prompt with context, knowledge base, and scenario
      let systemPrompt = constantsMap.osce_practice_chat_completion_prompt
      let knowledgeBase = ""
      if (session.osce_topic?.knowledge_base) {
          knowledgeBase = "Basis Pengetahuan Referensi (hanya untuk konteks):\n" +
            `${session.osce_topic?.knowledge_base.map(kb => `[${kb.key}]\n${kb.value}`).join('\n\n')}\n` +
            "Basis pengetahuan ini disediakan hanya sebagai informasi referensi untuk membantu Anda memahami skenario klinis dan memberikan respons yang relevan.\n"
      }
      const templateData = {
        context: session.osce_topic.context,
        scenario: session.osce_topic.scenario,
        knowledgeBase: knowledgeBase,
      }

      Object.entries(templateData).forEach(([key, value]) => {
          systemPrompt = systemPrompt.replaceAll(`{{${key}}}`, value)
      });

      // Get AI response with streaming
      const result = await this._getAIStreamingResponse({
        model: session.osce_topic.ai_model,
        systemPrompt,
        conversationHistory: session.osce_session_messages,
        userMessage: message,
        sessionId: session.id,
        userId,
        messageCost,
        requiresCredits,
        onStream,
        onComplete,
        onError,
        checkClientConnected,
        streamAbortSignal,
      })

      return result
    } catch (error) {
      console.error('[SendOsceMessageService] Error:', error)
      if (onError) {
        onError(error)
      }
      throw error
    }
  }

  static async _getAIStreamingResponse({
    model,
    systemPrompt,
    conversationHistory,
    userMessage,
    sessionId,
    userId,
    messageCost,
    requiresCredits,
    onStream,
    onComplete,
    onError,
    checkClientConnected,
    streamAbortSignal,
  }) {
    // Get the appropriate AI service based on model
    const AIService = RouterUtils.call(model)

    if (!AIService) {
      throw new Error(`No AI service found for model: ${model}`)
    }

    // Use the service's streaming method with conversation history
    const stream = await AIService.generateStreamWithHistory(
      model,
      systemPrompt,
      conversationHistory.reverse(),
      userMessage,
    )

    // Handle streaming with chunking and pacing (like Skripsi builder)
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let accumulatedChunk = ''
    let userMessageRecord = null
    let aiMessageRecord = null

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    // Track if first chunk has been sent (for credit deduction)
    let isFirstChunk = true
    let newBalance = null
    let creditBreakdown = null

    try {
      // Determine stream type (Gemini vs Perplexity/OpenAI)
      const isGeminiStyle = stream[Symbol.asyncIterator] !== undefined

      if (isGeminiStyle) {
        // Gemini-style async generator
        for await (const chunk of stream) {
          // Check if stream was aborted
          if (streamAbortSignal && streamAbortSignal.aborted) {
            console.log('Stream aborted - client disconnected')
            streamAborted = true
            break
          }

          if (checkClientConnected && !checkClientConnected()) {
            console.log('Client disconnected - stopping stream processing')
            streamAborted = true
            break
          }

          const text = chunk.text

          if (text) {
            fullResponseFromAI += text
            accumulatedChunk += text

            // Send chunks when we have 20+ characters
            while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
              const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
              accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

              // Deduct credits on FIRST chunk
              if (isFirstChunk && requiresCredits && messageCost > 0) {
                const result = await prisma.$transaction(tx => deductUserCredits(tx, userId, messageCost, `OSCE Practice - Message in session`))
                newBalance = result.newBalance
                creditBreakdown = await getCreditBreakdown(userId)
              }

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
                    chunkData.data.userQuota = {
                      balance: newBalance,
                      permanentBalance: creditBreakdown?.permanentBalance ?? newBalance,
                      expiringBuckets: creditBreakdown?.expiringBuckets ?? []
                    }
                  }
                  isFirstChunk = false // Always mark first chunk as sent
                }

                onStream(chunkData, () => {
                  // Only add to sentContentToClient if callback fires
                  sentContentToClient += chunkToSend
                })
              } catch (e) {
                console.log('Client disconnected during chunk send')
                streamAborted = true
                break
              }

              // Check abort before delay
              if (streamAbortSignal && streamAbortSignal.aborted) {
                console.log('Stream aborted during pacing delay')
                streamAborted = true
                break
              }

              // Delay: 20 chars * 10ms * 2 = 400ms
              const delay = CHARS_PER_CHUNK * TYPING_SPEED_MS
              await new Promise(resolve => setTimeout(resolve, delay))
            }
          }

          if (streamAborted) break
        }
      } else {
        // Perplexity/OpenAI-style stream object
        for await (const chunk of stream) {
          if (streamAbortSignal && streamAbortSignal.aborted) {
            console.log('Stream aborted - client disconnected')
            streamAborted = true
            break
          }

          if (checkClientConnected && !checkClientConnected()) {
            console.log('Client disconnected - stopping stream processing')
            streamAborted = true
            break
          }

          const content = chunk.choices?.[0]?.delta?.content || ''

          if (content) {
            fullResponseFromAI += content
            accumulatedChunk += content

            // Send chunks when we have 20+ characters
            while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
              const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
              accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

              // Deduct credits on FIRST chunk
              if (isFirstChunk && requiresCredits && messageCost > 0) {
                const result = await prisma.$transaction(tx => deductUserCredits(tx, userId, messageCost, `OSCE Practice - Message in session`))
                newBalance = result.newBalance
                creditBreakdown = await getCreditBreakdown(userId)
              }

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
                    chunkData.data.userQuota = {
                      balance: newBalance,
                      permanentBalance: creditBreakdown?.permanentBalance ?? newBalance,
                      expiringBuckets: creditBreakdown?.expiringBuckets ?? []
                    }
                  }
                  isFirstChunk = false // Always mark first chunk as sent
                }

                onStream(chunkData, () => {
                  sentContentToClient += chunkToSend
                })
              } catch (e) {
                console.log('Client disconnected during chunk send')
                streamAborted = true
                break
              }

              if (streamAbortSignal && streamAbortSignal.aborted) {
                console.log('Stream aborted during pacing delay')
                streamAborted = true
                break
              }

              const delay = CHARS_PER_CHUNK * TYPING_SPEED_MS
              await new Promise(resolve => setTimeout(resolve, delay))
            }
          }

          if (streamAborted) break
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

      // Save what was actually sent to client
      const contentToSave = streamAborted ? sentContentToClient : fullResponseFromAI

      console.log(`Stream ${streamAborted ? 'aborted' : 'completed'}.`)
      console.log(`  - Full AI response: ${fullResponseFromAI.length} chars`)
      console.log(`  - Sent to client: ${sentContentToClient.length} chars`)
      console.log(`  - Saving: ${contentToSave.length} chars`)

      // Save messages to database
      try {
        userMessageRecord = await prisma.osce_session_messages.create({
          data: {
            osce_session_id: sessionId,
            sender_type: 'user',
            content: userMessage,
            credits_used: 0,
          },
        })

        aiMessageRecord = await prisma.osce_session_messages.create({
          data: {
            osce_session_id: sessionId,
            sender_type: 'ai',
            content: contentToSave,
            credits_used: messageCost,
          },
        })

        // Credits already deducted when first chunk was sent

        // Update session's total credits used
        await prisma.osce_sessions.update({
          where: { id: sessionId },
          data: {
            credits_used: { increment: messageCost }
          }
        })

        // Send completion
        if (onComplete) {
          onComplete({
            userMessage: {
              id: userMessageRecord.id,
              senderType: 'user',
              content: userMessageRecord.content,
              createdAt: userMessageRecord.created_at.toISOString()
            },
            aiMessage: {
              id: aiMessageRecord.id,
              senderType: 'ai',
              content: aiMessageRecord.content,
              creditsUsed: messageCost,
              createdAt: aiMessageRecord.created_at.toISOString()
            }
          })
        }

        return {
          userMessage: userMessageRecord,
          aiMessage: aiMessageRecord
        }
      } catch (dbError) {
        console.error('Database error after streaming:', dbError)
        if (onError) {
          onError(new Error(`Failed to save message: ${dbError.message}`))
        }
        throw dbError
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Stream aborted by user')
        // Let it continue to save partial content
      } else {
        console.error('Streaming error:', error)
        throw error
      }
    }
  }
}
