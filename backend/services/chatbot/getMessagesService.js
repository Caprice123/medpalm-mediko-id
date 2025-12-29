import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetMessagesService extends BaseService {
  static async call({ userId, conversationId, page = 1, perPage = 50 }) {
    this.validate({ userId, conversationId, page, perPage })

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

    const skip = (page - 1) * perPage
    const take = perPage + 1

    const messages = await prisma.chatbot_messages.findMany({
      where: {
        conversation_id: conversationId,
        is_deleted: false
      },
      take,
      skip,
      include: {
        chatbot_message_sources: {
          orderBy: { score: 'desc' }
        },
        chatbot_message_feedbacks: {
          where: { user_id: userId }
        }
      },
      orderBy: {
        created_at: 'desc' // Return newest first (page 1 = most recent)
      }
    })

    const isLastPage = messages.length <= perPage
    const paginatedMessages = messages.slice(0, perPage)

    return {
      messages: paginatedMessages,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }

  static validate({ userId, conversationId, page, perPage }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }

    if (!conversationId || isNaN(parseInt(conversationId))) {
      throw new ValidationError('Invalid conversation ID')
    }

    if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
      throw new ValidationError('Invalid page number')
    }

    if (perPage) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 100) {
        throw new ValidationError('Invalid perPage. Must be between 1 and 100')
      }
    }
  }
}
