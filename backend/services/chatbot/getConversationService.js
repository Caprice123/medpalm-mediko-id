import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetConversationService extends BaseService {
  static async call({ userId, conversationId }) {
    this.validate({ userId, conversationId })

    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        unique_id: conversationId,
        is_deleted: false
      },
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    // Verify ownership
    if (conversation.user_id !== userId) {
      throw new ValidationError('You do not have access to this conversation')
    }

    return {
      id: conversation.id,
      uniqueId: conversation.unique_id,
      topic: conversation.topic,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at
    }
  }

  static validate({ userId, conversationId }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId || typeof conversationId !== 'string') {
      throw new ValidationError('Invalid conversation ID')
    }
  }
}
