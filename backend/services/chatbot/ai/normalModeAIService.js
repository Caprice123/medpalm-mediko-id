import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { RouterUtils } from '#utils/aiUtils/routerUtils'


export class NormalModeAIService extends BaseService {
  /**
   * Generate AI response using Normal Mode (Gemini only, no RAG)
   * @param {Object} params - Parameters
   * @param {number} params.userId - User ID
   * @param {number} params.conversationId - Conversation ID
   * @param {string} params.message - User's message
   * @returns {Promise<Object>} AI response with credits used
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get chatbot constants for configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_normal_enabled',
              'chatbot_normal_model',
              'chatbot_normal_last_message_count',
              'chatbot_normal_system_prompt',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeActive = constantsMap.chatbot_normal_enabled === 'true'
      if (!modeActive) {
        throw new ValidationError("Normal mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const modelName = constantsMap.chatbot_normal_model || 'gemini-2.5-flash'
      const lastMessageCount = parseInt(constantsMap.chatbot_normal_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_normal_system_prompt

      // Get conversation history
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { id: 'desc' },
        take: lastMessageCount,
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

      // Generate streaming response using RouterUtils
      console.log('Generating AI response (streaming)...')
      const AIService = RouterUtils.call(modelName)

      if (!AIService) {
        throw new Error(`No AI provider found for model: ${modelName}`)
      }

      const stream = await AIService.generateStreamWithHistory(
        modelName,
        systemPrompt,
        conversationHistory,
        message,
      )

      return {
        stream: stream,
        creditsUsed: 0, // Credits calculated by provider
        sources: [],
        provider: RouterUtils.getProvider(modelName),
      }
    } catch (error) {
      console.error('Error in Normal Mode AI Service:', error)
      throw new Error('Failed to generate AI response: ' + error.message)
    }
  }
}
