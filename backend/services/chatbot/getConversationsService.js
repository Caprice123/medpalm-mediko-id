import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetConversationsService extends BaseService {
  static async call({ userId, page = 1, perPage = 20, search }) {
    this.validate({ userId, page, perPage })

    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = {
      user_id: userId,
      is_deleted: false
    }

    if (search) {
      where.topic = {
        contains: search,
        mode: 'insensitive'
      }
    }

    const conversations = await prisma.chatbot_conversations.findMany({
      where,
      take,
      skip,
      include: {
        chatbot_messages: {
          where: { is_deleted: false },
          orderBy: { created_at: 'desc' },
          take: 1, // Get last message for preview
          select: {
            content: true,
            sender_type: true,
            mode_type: true,
            created_at: true
          }
        },
      },
      orderBy: {
        updated_at: 'desc'
      }
    })

    const isLastPage = conversations.length <= perPage
    const paginatedConversations = conversations.slice(0, perPage)

    const transformedConversations = paginatedConversations.map(conv => ({
      id: conv.id,
      topic: conv.topic,
      lastMessage: conv.last_message || null,
      createdAt: conv.created_at,
      updatedAt: conv.updated_at
    }))

    return {
      data: transformedConversations,
      pagination: {
        page,
        perPage,
        isLastPage
      }
    }
  }

  static validate({ userId, page, perPage }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
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
