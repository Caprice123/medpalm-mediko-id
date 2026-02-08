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
        unique_id: conversationId,
        is_deleted: false
      }
    })

    if (!conversation) {
      throw new NotFoundError('Conversation not found')
    }

    if (conversation.user_id !== userId) {
      throw new AuthorizationError('You do not have access to this conversation')
    }

    // Update conversation using internal id
    const updatedConversation = await prisma.chatbot_conversations.update({
      where: { id: conversation.id },
      data: { topic }
    })

    return {
      id: updatedConversation.id,
      uniqueId: updatedConversation.unique_id,
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

    if (!conversationId || typeof conversationId !== 'string') {
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
