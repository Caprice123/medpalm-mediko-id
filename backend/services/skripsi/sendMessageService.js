import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'
import { SkripsiAIService } from '#services/skripsi/ai/skripsiAIService'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'

export class SendMessageService extends BaseService {
  static async call({ tabId, userId, message, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
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
            'skripsi_is_active',
            'skripsi_access_type',
            `skripsi_${mode}_enabled`,
            `skripsi_${mode}_cost`
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if feature is globally active
    const featureActive = constantsMap.skripsi_is_active === 'true'
    if (!featureActive) {
      throw new ValidationError('Fitur Skripsi Builder sedang tidak aktif. Silakan coba beberapa saat lagi')
    }

    // Check if specific mode is enabled
    const modeEnabled = constantsMap[`skripsi_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} sedang tidak aktif`)
    }

    // Check user access based on access type
    const accessType = constantsMap.skripsi_access_type || 'subscription'
    const requiresSubscription = accessType === 'subscription' || accessType === 'subscription_and_credits'
    const requiresCredits = accessType === 'credits' || accessType === 'subscription_and_credits'

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
    if (requiresCredits && (!hasSubscription || accessType === 'credits')) {
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
      const result = await SkripsiAIService.call({
        tabId,
        message: message.trim(),
        tabType: tab.tab_type
      })

      // Handle streaming response
      if (onStream && result.stream) {
        // Determine if it's Perplexity or Gemini based on model
        const mode = this.getMode(tab.tab_type)
        const constants = await prisma.constants.findMany({
          where: { key: { in: [`skripsi_${mode}_model`] } }
        })
        const constantsMap = {}
        constants.forEach(c => { constantsMap[c.key] = c.value })
        const modelName = constantsMap[`skripsi_${mode}_model`] || 'gemini-2.0-flash-exp'
        const isPerplexity = modelName.startsWith('sonar')

        if (isPerplexity) {
          return await this.handlePerplexityStreamingResponse({
            tabId,
            setId: tab.set_id,
            userId,
            userMessageContent: message.trim(),
            stream: result.stream,
            messageCost,
            onStream,
            onComplete,
            onError,
            checkClientConnected,
            streamAbortSignal
          })
        } else {
          return await this.handleStreamingResponse({
            tabId,
            setId: tab.set_id,
            userId,
            userMessageContent: message.trim(),
            stream: result.stream,
            messageCost,
            onStream,
            onComplete,
            onError,
            checkClientConnected,
            streamAbortSignal
          })
        }
      }

      // Non-streaming fallback (shouldn't reach here with current implementation)
      throw new Error('Streaming is required for Skripsi Builder')
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
  static async handlePerplexityStreamingResponse({ tabId, setId, userId, userMessageContent, stream, messageCost, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
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

    try {
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

        const content = chunk.choices[0]?.delta?.content || ''

        if (content) {
          // Don't add to fullResponseFromAI if client already disconnected
          if (streamAborted || (streamAbortSignal && streamAbortSignal.aborted)) {
            console.log('Skipping chunk - client disconnected')
            break
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

            // Try to send chunk to client
            try {
              onStream({
                type: 'chunk',
                data: {
                  content: chunkToSend
                }
              }, () => {
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

        // Extract and send citations if available
        if (chunk.citations && chunk.citations.length > 0) {
          chunk.citations.forEach(citation => {
            if (!sentCitations.has(citation)) {
              sentCitations.add(citation)
              citations.push(citation)

              // Send citation to client immediately
              try {
                onStream({
                  type: 'citation',
                  data: {
                    url: citation,
                    title: citation.substring(0, 200)
                  }
                })
              } catch (e) {
                // Ignore if client disconnected
              }
            }
          })
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
      console.log(`  - Saving: ${contentToSave.length} chars`)

      // Streaming complete - NOW save messages to database and deduct credits
      try {
        userMessage = await prisma.skripsi_messages.create({
          data: {
            tab_id: tabId,
            sender_type: 'user',
            content: userMessageContent
          }
        })

        aiMessage = await prisma.skripsi_messages.create({
          data: {
            tab_id: tabId,
            sender_type: 'ai',
            content: contentToSave
          }
        })

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          // Get full user credit record before deduction
          const userCredit = await prisma.user_credits.findUnique({
            where: { user_id: userId }
          })

          // Deduct credits
          await prisma.user_credits.update({
            where: { user_id: userId },
            data: {
              balance: { decrement: messageCost }
            }
          })

          // Get updated balance
          const creditAfter = await prisma.user_credits.findUnique({
            where: { user_id: userId },
            select: { balance: true }
          })

          // Log credit transaction
          await prisma.credit_transactions.create({
            data: {
              user_id: userId,
              user_credit_id: userCredit.id,
              amount: -messageCost,
              type: 'deduction',
              description: `Skripsi Builder - Message sent`,
              balance_before: userCredit.balance,
              balance_after: creditAfter.balance,
              payment_status: 'completed'
            }
          })
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
            createdAt: userMessage.created_at.toISOString()
          },
          aiMessage: {
            id: aiMessage.id,
            senderType: aiMessage.sender_type,
            content: aiMessage.content,
            createdAt: aiMessage.created_at.toISOString()
          },
          sources: citations
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
  static async handleStreamingResponse({ tabId, setId, userId, userMessageContent, stream, messageCost, onStream, onComplete, onError, checkClientConnected, streamAbortSignal }) {
    let fullResponseFromAI = ''
    let sentContentToClient = ''
    let streamAborted = false
    let clientStillConnected = true
    let accumulatedChunk = '' // Buffer to accumulate 20 characters
    let userMessage = null
    let aiMessage = null

    const CHARS_PER_CHUNK = 20
    const TYPING_SPEED_MS = 1

    try {
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

        const text = chunk.text()

        if (text) {
          fullResponseFromAI += text
          accumulatedChunk += text

          // Send chunk when we have 20+ characters
          while (accumulatedChunk.length >= CHARS_PER_CHUNK) {
            const chunkToSend = accumulatedChunk.substring(0, CHARS_PER_CHUNK)
            accumulatedChunk = accumulatedChunk.substring(CHARS_PER_CHUNK)

            // Try to send chunk to client
            try {
              onStream({
                type: 'chunk',
                data: {
                  content: chunkToSend
                }
              }, () => {
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

      // Streaming complete - NOW save messages to database and deduct credits
      try {
        userMessage = await prisma.skripsi_messages.create({
          data: {
            tab_id: tabId,
            sender_type: 'user',
            content: userMessageContent
          }
        })

        aiMessage = await prisma.skripsi_messages.create({
          data: {
            tab_id: tabId,
            sender_type: 'ai',
            content: contentToSave
          }
        })

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          // Get full user credit record before deduction
          const userCredit = await prisma.user_credits.findUnique({
            where: { user_id: userId }
          })

          // Deduct credits
          await prisma.user_credits.update({
            where: { user_id: userId },
            data: {
              balance: { decrement: messageCost }
            }
          })

          // Get updated balance
          const creditAfter = await prisma.user_credits.findUnique({
            where: { user_id: userId },
            select: { balance: true }
          })

          // Log credit transaction
          await prisma.credit_transactions.create({
            data: {
              user_id: userId,
              user_credit_id: userCredit.id,
              amount: -messageCost,
              type: 'deduction',
              description: `Skripsi Builder - Message sent`,
              balance_before: userCredit.balance,
              balance_after: creditAfter.balance,
              payment_status: 'completed'
            }
          })
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
            createdAt: userMessage.created_at.toISOString()
          },
          aiMessage: {
            id: aiMessage.id,
            senderType: aiMessage.sender_type,
            content: aiMessage.content,
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
