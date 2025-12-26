import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'
import { ValidationError } from '../../errors/validationError.js'
import { SkripsiAIService } from './ai/skripsiAIService.js'
import { HasActiveSubscriptionService } from '../pricing/getUserStatusService.js'

export class SendMessageService extends BaseService {
  static async call({ tabId, userId, message, onStream, onComplete, onError }) {
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
          where: { userId: userId }
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
        return await this.handleStreamingResponse({
          tabId,
          setId: tab.set_id,
          userId,
          userMessageContent: message.trim(),
          stream: result.stream,
          messageCost,
          onStream,
          onComplete,
          onError
        })
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
   * Handle streaming response from Gemini
   */
  static async handleStreamingResponse({ tabId, setId, userId, userMessageContent, stream, messageCost, onStream, onComplete, onError }) {
    let fullResponse = ''
    let userMessage = null
    let aiMessage = null

    try {
      // Process Gemini stream chunks
      for await (const chunk of stream) {
        const text = chunk.text()

        if (text) {
          fullResponse += text

          // Send chunk to client
          onStream({
            type: 'chunk',
            data: {
              content: text
            }
          })
        }
      }

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
            content: fullResponse
          }
        })

        // Deduct credits if cost > 0
        if (messageCost > 0) {
          // Get full user credit record before deduction
          const userCredit = await prisma.user_credits.findUnique({
            where: { userId: userId }
          })

          // Deduct credits
          await prisma.user_credits.update({
            where: { userId: userId },
            data: {
              balance: { decrement: messageCost }
            }
          })

          // Get updated balance
          const creditAfter = await prisma.user_credits.findUnique({
            where: { userId: userId },
            select: { balance: true }
          })

          // Log credit transaction
          await prisma.credit_transactions.create({
            data: {
              userId: userId,
              userCreditId: userCredit.id,
              amount: -messageCost,
              type: 'deduction',
              description: `Skripsi Builder - Message sent`,
              balanceBefore: userCredit.balance,
              balanceAfter: creditAfter.balance,
              paymentStatus: 'completed'
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

        // Send completion
        onComplete({
          userMessage: {
            id: userMessage.id,
            sender_type: userMessage.sender_type,
            content: userMessage.content,
            created_at: userMessage.created_at
          },
          aiMessage: {
            id: aiMessage.id,
            sender_type: aiMessage.sender_type,
            content: aiMessage.content,
            created_at: aiMessage.created_at
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
