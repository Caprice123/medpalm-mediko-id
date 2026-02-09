import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteAdminConversationService extends BaseService {
  static async call({ conversationId }) {
    this.validate({ conversationId })

    const conversation = await prisma.chatbot_conversations.findFirst({
      where: { unique_id: conversationId, is_deleted: false },
      select: { id: true }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    // Hard delete for admin (cascade delete will handle messages, sources, feedbacks)
    await prisma.chatbot_conversations.delete({
      where: { id: conversation.id }
    })

    return true
  }

  static validate({ conversationId }) {
    if (!conversationId || typeof conversationId !== 'string') {
      throw new ValidationError('Invalid conversation ID')
    }
  }
}
