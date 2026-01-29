import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { NotFoundError } from '#errors/notFoundError'
import { AuthorizationError } from '#errors/authorizationError'

export class UpdateConversationService extends BaseService {
  static async call({ userId, conversationId, topic }) {
    this.validate({ userId, conversationId, topic })

    // Verify conversation exists and user has access
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        is_deleted: false
      }
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    if (conversation.user_id !== userId) {
      throw new AuthorizationError('You do not have access to this conversation')
    }

    // Update conversation
    const updatedConversation = await prisma.chatbot_conversations.update({
      where: { id: conversationId },
      data: { topic }
    })

    return {
      id: updatedConversation.id,
      topic: updatedConversation.topic,
      lastMessage: updatedConversation.last_message || null,
      createdAt: updatedConversation.created_at,
      updatedAt: updatedConversation.updated_at
    }
  }

  static validate({ userId, conversationId, topic }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId || isNaN(parseInt(conversationId))) {
      throw new ValidationError('Invalid conversation ID')
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      throw new ValidationError('Topic is required')
    }

    if (topic.length > 255) {
      throw new ValidationError('Topic is too long (max 255 characters)')
    }
  }
}
