import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAdminConversationMessagesService extends BaseService {
  static async call({ conversationId, page = 1, perPage = 50 }) {
    this.validate({ conversationId, page, perPage })

    // Verify conversation exists
    const conversation = await prisma.chatbot_conversations.findFirst({
      where: {
        id: conversationId,
        is_deleted: false
      }
    })

    if (!conversation) {
      throw new ValidationError('Conversation not found')
    }

    const skip = (page - 1) * perPage
    const take = perPage + 1 // Take one extra to check if there are more

    // Get messages for this conversation with pagination (DESC order - newest first for backend)
    const messages = await prisma.chatbot_messages.findMany({
      where: {
        conversation_id: conversationId,
        is_deleted: false
      },
      include: {
        chatbot_message_sources: {
          orderBy: { score: 'desc' }
        }
      },
      orderBy: {
        created_at: 'desc' // Backend returns DESC (newest first)
      },
      skip,
      take
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

  static validate({ conversationId, page, perPage }) {
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
