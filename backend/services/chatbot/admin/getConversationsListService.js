import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetConversationsListService extends BaseService {
  static async call({ page = 1, perPage = 30, search = '', userId = null } = {}) {
    try {
      // Build where clause
      const where = {
        is_deleted: false
      }

      // Search by topic title
      if (search && search.trim()) {
        where.topic = {
          contains: search.trim(),
          mode: 'insensitive'
        }
      }

      // Filter by specific user
      if (userId) {
        where.user_id = parseInt(userId)
      }

      // Get conversations with user info and message count
      const conversations = await prisma.chatbot_conversations.findMany({
        where,
        select: {
          id: true,
          user_id: true,
          topic: true,
          initial_mode: true,
          created_at: true,
          updated_at: true,
          users: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
        },
        orderBy: { updated_at: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage + 1
      })

      // Format response
      const formattedConversations = conversations.map(conv => ({
        id: conv.id,
        topic: conv.topic,
        initialMode: conv.initial_mode,
        messageCount: conv._count.chatbot_messages,
        user: {
          id: conv.users.id,
          name: conv.users.name,
          email: conv.users.email
        },
        createdAt: conv.created_at,
        updatedAt: conv.updated_at
      }))

      return {
        data: formattedConversations,
        pagination: {
          page,
          perPage,
          isLastPage: conversations.length <= perPage
        }
      }
    } catch (error) {
      console.error('Error fetching admin conversations list:', error)
      throw new Error('Failed to fetch conversations: ' + error.message)
    }
  }
}
