import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'

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
      if (!userId) throw new Error('User ID is required')
      if (!sessionId) throw new Error('Session ID is required')
      if (!message || !message.trim()) throw new Error('Message is required')

      // Get OSCE configuration from constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
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
        throw new Error('Session not found or access denied')
      }

    //   const messageCost = parseInt(constantsMap.osce_practice_credit_cost) || 5
      const messageCost = 0

      // Check user credits
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId },
      })

      if (!userCredit || userCredit.balance < messageCost) {
        throw new Error(`Insufficient credits. You need ${messageCost} credits to send a message`)
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

              try {
                onStream({
                  type: 'chunk',
                  data: {
                    content: chunkToSend
                  }
                }, () => {
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

              try {
                onStream({
                  type: 'chunk',
                  data: {
                    content: chunkToSend
                  }
                }, () => {
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

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          const userCredit = await prisma.user_credits.findUnique({
            where: { user_id: userId }
          })

          await prisma.user_credits.update({
            where: { user_id: userId },
            data: {
              balance: { decrement: messageCost }
            }
          })

          const creditAfter = await prisma.user_credits.findUnique({
            where: { user_id: userId },
            select: { balance: true }
          })

          await prisma.credit_transactions.create({
            data: {
              user_id: userId,
              user_credit_id: userCredit.id,
              type: 'deduction',
              amount: messageCost,
              balance_before: userCredit.balance,
              balance_after: creditAfter.balance,
              description: `OSCE Practice - Message in session`,
              payment_status: 'completed'
            }
          })
        }

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
