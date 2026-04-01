import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetAdminConversationsService extends BaseService {
  static async call({ page = 1, perPage = 20, userId, search }) {
    this.validate({ page, perPage, userId })

    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = {
      is_deleted: false
    }

    if (userId) {
      where.user_id = userId
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
        users: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        chatbot_messages: {
          where: { is_deleted: false },
          orderBy: { id: 'desc' },
          take: 1,
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
      userId: conv.user_id,
      topic: conv.topic,
      user: {
        id: conv.users.id,
        name: conv.users.name,
        email: conv.users.email
      },
      lastMessage: conv.chatbot_messages[0] || null,
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

  static validate({ page, perPage, userId }) {
    if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
      throw new ValidationError('Invalid page number')
    }

    if (perPage) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 100) {
        throw new ValidationError('Invalid perPage. Must be between 1 and 100')
      }
    }

    if (userId && isNaN(parseInt(userId))) {
      throw new ValidationError('Invalid user ID')
    }
  }
}
