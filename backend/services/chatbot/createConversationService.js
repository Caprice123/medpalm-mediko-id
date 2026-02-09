import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateConversationService extends BaseService {
  static async call({ userId, topic, initialMode }) {
    this.validate({ userId, topic, initialMode })

    const conversation = await prisma.chatbot_conversations.create({
      data: {
        user_id: userId,
        topic
      }
    })

    return {
      id: conversation.id,
      uniqueId: conversation.unique_id,
      topic: conversation.topic,
      messageCount: 0,
      lastMessage: null,
      createdAt: conversation.created_at,
      updatedAt: conversation.updated_at
    }
  }

  static validate({ userId, topic, initialMode }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!topic || typeof topic !== 'string' || topic.trim().length === 0) {
      throw new ValidationError('Topic is required')
    }

    if (topic.length > 255) {
      throw new ValidationError('Topic is too long (max 255 characters)')
    }

    if (initialMode && !['normal', 'validated', 'research'].includes(initialMode)) {
      throw new ValidationError('Invalid initial mode')
    }
  }
}
