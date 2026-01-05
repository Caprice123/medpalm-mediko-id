import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { NormalModeAIService } from '#services/chatbot/ai/normalModeAIService'
import { ValidatedSearchModeAIService } from '#services/chatbot/ai/validatedSearchModeAIService'
import { ResearchModeAIService } from '#services/chatbot/ai/researchModeAIService'
import { HasActiveSubscriptionService } from '#services/pricing/getUserStatusService'

export class SendMessageService extends BaseService {
  static async call({ userId, conversationId, message, mode, onStream, onComplete, onError }) {
    this.validate({ userId, conversationId, message, mode })

    // Verify conversation exists and user has access
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        is_deleted: false
      },
      select: { user_id: true }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    if (conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    // Fetch constants and user credits
    const constants = await prisma.constants.findMany({
      where: {
        key: {
          in: [
            'chatbot_is_active',
            'chatbot_access_type',
            `chatbot_${mode}_enabled`,
            `chatbot_${mode}_cost`
          ]
        }
      }
    })
    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if chatbot feature is active
    const featureActive = constantsMap.chatbot_is_active === 'true'
    if (!featureActive) {
      throw new ValidationError("Fitur sedang tidak aktif. Silakan coba beberapa saat lagi")
    }

    // Check if specific mode is enabled
    const modeEnabled = constantsMap[`chatbot_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} sedang tidak aktif. Silakan pilih mode lain`)
    }

    // Check user access based on access type
    const accessType = constantsMap.chatbot_access_type || 'subscription'
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
      messageCost = parseFloat(constantsMap[`chatbot_${mode}_cost`]) || 5

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
      if (mode === 'normal') {
        const result = await NormalModeAIService.call({ userId, conversationId, message })

        // Handle streaming for Normal mode (Gemini)
        if (onStream && result.stream) {
          return await this.handleGeminiStreamingResponse({
            userId,
            conversationId,
            userMessageContent: message,
            stream: result.stream,
            creditsUsed: creditsUsed,
            sources: [],
            mode,
            requiresCredits,
            onStream,
            onComplete,
            onError
          })
        }

        aiResponse = result.response
      } else if (mode === 'validated') {
        const result = await ValidatedSearchModeAIService.call({ userId, conversationId, message })

        // Handle streaming for Validated mode (Gemini + RAG)
        if (onStream && result.stream) {
          return await this.handleGeminiStreamingResponse({
            userId,
            conversationId,
            userMessageContent: message,
            stream: result.stream,
            creditsUsed: creditsUsed,
            sources: result.sources,
            mode,
            requiresCredits,
            onStream,
            onComplete,
            onError
          })
        }

        aiResponse = result.response
        sources = result.sources
      } else if (mode === 'research') {
        const result = await ResearchModeAIService.call({ userId, conversationId, message })

        // Handle streaming for Research mode (Perplexity)
        if (onStream && result.stream) {
          return await this.handlePerplexityStreamingResponse({
            userId,
            conversationId,
            userMessageContent: message,
            stream: result.stream,
            creditsUsed: creditsUsed,
            mode,
            requiresCredits,
            onStream,
            onComplete,
            onError
          })
        }

        // Non-streaming fallback
        aiResponse = result.response
        sources = result.sources
      }
    } catch (error) {
      // If AI service fails, handle error
      if (onError) {
        onError(error)
        return
      }
      aiResponse = 'Sorry, I encountered an error processing your message. Please try again.'
      console.error('AI Service Error:', error)
    }

    // Non-streaming path: Save user message now
    const userMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'user',
        mode_type: null,
        content: message,
        credits_used: 0
      }
    })

    // Save AI message
    const aiMessage = await prisma.chatbot_messages.create({
      data: {
        conversation_id: conversationId,
        sender_type: 'ai',
        mode_type: mode,
        content: aiResponse,
        credits_used: creditsUsed
      }
    })

    // Save sources if any
    if (sources.length > 0) {
      await prisma.chatbot_message_sources.createMany({
        data: sources.map(src => ({
          message_id: aiMessage.id,
          source_type: src.sourceType,
          title: src.title,
          content: src.content,
          url: src.url,
          score: src.score
        }))
      })
    }

    // Deduct credits from user and create transaction
    if (requiresCredits && creditsUsed > 0) {
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId }
      })

      const newBalance = userCredit.balance - creditsUsed

      // Update user credit balance
      await prisma.user_credits.update({
        where: { user_id: userId },
        data: { balance: newBalance }
      })

      // Create credit transaction record
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

    const messageCountKey = `chatbot_${mode}_message_count`
    const currentCount = await prisma.constants.findUnique({
      where: { key: messageCountKey }
    })

    if (currentCount) {
      await prisma.constants.update({
        where: { key: messageCountKey },
        data: {
          value: String(parseInt(currentCount.value) + 1),
          updated_at: new Date()
        }
      })
    } else {
      // Create if not exists
      await prisma.constants.create({
        data: {
          key: messageCountKey,
          value: '1'
        }
      })
    }

    // Update conversation updated_at
    await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: { updated_at: new Date() }
    })

    // Fetch the complete AI message with sources
    const completeAiMessage = await prisma.chatbot_messages.findUnique({
      where: { id: aiMessage.id },
      include: {
        chatbot_message_sources: {
          orderBy: { score: 'desc' }
        }
      }
    })

    return {
      userMessage: {
        id: userMessage.id,
        senderType: userMessage.sender_type,
        content: userMessage.content,
        created_at: userMessage.created_at
      },
      aiMessage: {
        id: completeAiMessage.id,
        senderType: completeAiMessage.sender_type,
        modeType: completeAiMessage.mode_type,
        content: completeAiMessage.content,
        creditsUsed: completeAiMessage.credits_used,
        sources: completeAiMessage.chatbot_message_sources.map(src => ({
          id: src.id,
          sourceType: src.source_type,
          title: src.title,
          content: src.content,
          url: src.url,
          score: src.score
        })),
        created_at: completeAiMessage.created_at
      }
    }
  }

  /**
   * Handle streaming response from Gemini (Normal and Validated modes)
   */
  static async handleGeminiStreamingResponse({ userId, conversationId, userMessageContent, stream, creditsUsed, sources, mode, requiresCredits, onStream, onComplete, onError }) {
    try {
      let fullResponse = ''

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

      // Streaming complete - NOW save user message to database
      const userMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessageContent,
          credits_used: 0
        }
      })

      // Save AI message to database
      const aiMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'ai',
          mode_type: mode,
          content: fullResponse,
          credits_used: creditsUsed
        }
      })

      // Save sources if any (for Validated mode)
      if (sources && sources.length > 0) {
        await prisma.chatbot_message_sources.createMany({
          data: sources.map(src => ({
            message_id: aiMessage.id,
            source_type: src.sourceType,
            title: src.title,
            content: src.content,
            url: src.url,
            score: src.score
          }))
        })
      }

      // Deduct credits from user and create transaction
      if (requiresCredits && creditsUsed > 0) {
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        const newBalance = userCredit.balance - creditsUsed

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

      const messageCountKey = `chatbot_${mode}_message_count`
      const currentCount = await prisma.constants.findUnique({
        where: { key: messageCountKey }
      })

      if (currentCount) {
        await prisma.constants.update({
          where: { key: messageCountKey },
          data: {
            value: String(parseInt(currentCount.value) + 1),
            updated_at: new Date()
          }
        })
      } else {
        await prisma.constants.create({
          data: {
            key: messageCountKey,
            value: '1'
          }
        })
      }

      // Update conversation timestamp
      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() }
      })

      // Send completion
      onComplete({
        userMessage: {
          id: userMessage.id,
          senderType: userMessage.sender_type,
          content: userMessage.content,
          created_at: userMessage.created_at
        },
        aiMessage: {
          id: aiMessage.id,
          senderType: aiMessage.sender_type,
          modeType: aiMessage.mode_type,
          content: aiMessage.content,
          creditsUsed: aiMessage.credits_used,
          sources: sources || [],
          created_at: aiMessage.created_at
        }
      })
    } catch (error) {
      console.error('Gemini streaming error:', error)
      if (onError) {
        onError(error)
      }
    }
  }

  /**
   * Handle streaming response from Perplexity (Research mode)
   */
  static async handlePerplexityStreamingResponse({ userId, conversationId, userMessageContent, stream, creditsUsed, mode, requiresCredits, onStream, onComplete, onError }) {
    try {
      let fullResponse = ''
      const citations = []
      const sentCitations = new Set()

      // Process stream chunks
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || ''

        if (content) {
          fullResponse += content

          // Send chunk to client
          onStream({
            type: 'chunk',
            data: {
              content: content
            }
          })
        }

        // Extract and send citations if available
        if (chunk.citations && chunk.citations.length > 0) {
          chunk.citations.forEach(citation => {
            if (!sentCitations.has(citation)) {
              sentCitations.add(citation)
              citations.push(citation)

              // Send citation to client immediately
              onStream({
                type: 'citation',
                data: {
                  url: citation,
                  title: citation.substring(0, 200)
                }
              })
            }
          })
        }
      }

      // Streaming complete - NOW save user message to database
      const userMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'user',
          mode_type: null,
          content: userMessageContent,
          credits_used: 0
        }
      })

      // Save AI message to database
      const aiMessage = await prisma.chatbot_messages.create({
        data: {
          conversation_id: conversationId,
          sender_type: 'ai',
          mode_type: mode,
          content: fullResponse,
          credits_used: creditsUsed
        }
      })

      // Save sources/citations if any
      const sources = []
      if (citations.length > 0) {
        const uniqueCitations = [...new Set(citations)]

        await prisma.chatbot_message_sources.createMany({
          data: uniqueCitations.slice(0, 10).map((citation, index) => ({
            message_id: aiMessage.id,
            source_type: 'web_search',
            title: citation.substring(0, 200),
            content: citation.substring(0, 500),
            url: citation,
            score: 1.0 - (index * 0.1)
          }))
        })

        // Format sources for response
        sources.push(...uniqueCitations.slice(0, 10).map((citation, index) => ({
          sourceType: 'web_search',
          title: citation.substring(0, 200),
          content: citation.substring(0, 500),
          url: citation,
          score: 1.0 - (index * 0.1)
        })))
      }

      // Deduct credits from user and create transaction
      if (requiresCredits && creditsUsed > 0) {
        const userCredit = await prisma.user_credits.findUnique({
          where: { user_id: userId }
        })

        const newBalance = userCredit.balance - creditsUsed

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

      const messageCountKey = `chatbot_${mode}_message_count`
      const currentCount = await prisma.constants.findUnique({
        where: { key: messageCountKey }
      })

      if (currentCount) {
        await prisma.constants.update({
          where: { key: messageCountKey },
          data: {
            value: String(parseInt(currentCount.value) + 1),
            updated_at: new Date()
          }
        })
      } else {
        await prisma.constants.create({
          data: {
            key: messageCountKey,
            value: '1'
          }
        })
      }

      // Update conversation timestamp
      await prisma.chatbot_conversations.update({
        where: { id: conversationId },
        data: { updated_at: new Date() }
      })

      // Send completion
      onComplete({
        userMessage: {
          id: userMessage.id,
          senderType: userMessage.sender_type,
          content: userMessage.content,
          created_at: userMessage.created_at
        },
        aiMessage: {
          id: aiMessage.id,
          senderType: aiMessage.sender_type,
          modeType: aiMessage.mode_type,
          content: aiMessage.content,
          creditsUsed: aiMessage.credits_used,
          sources: sources,
          created_at: aiMessage.created_at
        }
      })
    } catch (error) {
      console.error('Streaming error:', error)
      if (onError) {
        onError(error)
      }
    }
  }

  static validate({ userId, conversationId, message, mode }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId || isNaN(parseInt(conversationId))) {
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
