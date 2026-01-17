import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GoogleGenerativeAI } from '@google/generative-ai'

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
              system_prompt: true,
              ai_model: true,
            },
          },
          osce_session_messages: {
            orderBy: {
              created_at: 'asc',
            },
            take: 50, // Last 50 messages for context
          },
        },
      })

      if (!session) {
        throw new Error('Session not found or access denied')
      }

      // Check OSCE feature is active
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['osce_practice_is_active', 'osce_practice_credit_cost'],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => {
        constantsMap[c.key] = c.value
      })

      const featureActive = constantsMap.osce_practice_is_active === 'true'
      if (!featureActive) {
        throw new Error('OSCE Practice feature is currently inactive')
      }

      const messageCost = parseInt(constantsMap.osce_practice_credit_cost) || 5

      // Check user credits
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId },
      })

      if (!userCredit || userCredit.balance < messageCost) {
        throw new Error(`Insufficient credits. You need ${messageCost} credits to send a message`)
      }

      // Build conversation history
      const conversationHistory = this._buildConversationHistory(
        session.osce_topic.system_prompt,
        session.osce_topic.scenario,
        session.osce_session_messages
      )

      // Get AI response with streaming
      const aiResponse = await this._getAIStreamingResponse({
        conversationHistory,
        userMessage: message,
        aiModel: session.osce_topic.ai_model,
        onStream,
        checkClientConnected,
        streamAbortSignal,
      })

      // Save user message
      const userMessageRecord = await prisma.osce_session_messages.create({
        data: {
          osce_session_id: session.id,
          sender_type: 'user',
          content: message,
          credits_used: 0,
        },
      })

      // Save AI message
      const aiMessageRecord = await prisma.osce_session_messages.create({
        data: {
          osce_session_id: session.id,
          sender_type: 'ai',
          content: aiResponse,
          credits_used: messageCost,
        },
      })

      // Deduct credits
      await prisma.user_credits.update({
        where: { user_id: userId },
        data: {
          balance: { decrement: messageCost },
        },
      })

      // Record credit transaction
      await prisma.credit_transactions.create({
        data: {
          user_id: userId,
          user_credit_id: userCredit.id,
          type: 'deduction',
          amount: messageCost,
          balance_before: userCredit.balance,
          balance_after: userCredit.balance - messageCost,
          description: `OSCE Practice - Message in session ${session.unique_id}`,
          session_id: session.id,
        },
      })

      // Update session's total credits used
      await prisma.osce_sessions.update({
        where: { id: session.id },
        data: {
          credits_used: { increment: messageCost },
        },
      })

      // Return complete result
      if (onComplete) {
        onComplete({
          userMessage: {
            id: userMessageRecord.id,
            senderType: 'user',
            content: userMessageRecord.content,
            createdAt: userMessageRecord.created_at,
          },
          aiMessage: {
            id: aiMessageRecord.id,
            senderType: 'ai',
            content: aiMessageRecord.content,
            creditsUsed: messageCost,
            createdAt: aiMessageRecord.created_at,
          },
        })
      }

      return {
        userMessage: userMessageRecord,
        aiMessage: aiMessageRecord,
      }
    } catch (error) {
      console.error('[SendOsceMessageService] Error:', error)
      if (onError) {
        onError(error)
      }
      throw error
    }
  }

  static _buildConversationHistory(systemPrompt, scenario, messages) {
    const history = []

    // Add system context
    history.push({
      role: 'user',
      parts: [
        {
          text: `${systemPrompt}\n\nSCENARIO:\n${scenario}\n\nPlease stay in character and respond naturally as described in the scenario.`,
        },
      ],
    })

    history.push({
      role: 'model',
      parts: [{ text: 'I understand. I will play this role naturally and stay in character throughout our conversation.' }],
    })

    // Add conversation history
    messages.forEach(msg => {
      history.push({
        role: msg.sender_type === 'user' ? 'user' : 'model',
        parts: [{ text: msg.content }],
      })
    })

    return history
  }

  static async _getAIStreamingResponse({
    conversationHistory,
    userMessage,
    aiModel,
    onStream,
    checkClientConnected,
    streamAbortSignal,
  }) {
    // Initialize Gemini (default model for OSCE)
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

    // Use gemini-1.5-pro as default
    const modelName = aiModel?.includes('gemini') ? aiModel : 'gemini-1.5-pro'
    const model = genAI.getGenerativeModel({ model: modelName })

    // Add user message to history
    const fullHistory = [
      ...conversationHistory,
      {
        role: 'user',
        parts: [{ text: userMessage }],
      },
    ]

    const chat = model.startChat({
      history: fullHistory.slice(0, -1), // All except last message
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      },
    })

    // Stream the response
    const result = await chat.sendMessageStream(userMessage, {
      signal: streamAbortSignal,
    })

    let fullResponse = ''

    for await (const chunk of result.stream) {
      // Check if client disconnected
      if (checkClientConnected && !checkClientConnected()) {
        console.log('Client disconnected, stopping stream')
        break
      }

      const chunkText = chunk.text()
      fullResponse += chunkText

      // Send chunk to client
      if (onStream) {
        onStream(
          { type: 'chunk', content: chunkText },
          () => {
            // Callback after sending chunk
          }
        )
      }
    }

    return fullResponse
  }
}
