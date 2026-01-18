import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSessionMessagesService extends BaseService {
  static async call(userId, sessionId, options = {}) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    const { cursor, limit = 20 } = options

    // Verify session belongs to user
    const session = await prisma.osce_sessions.findFirst({
      where: {
        unique_id: sessionId,
        user_id: userId,
      },
    })

    if (!session) {
      throw new Error('Session not found or access denied')
    }

    // Build where clause
    const where = {
      osce_session_id: session.id,
    }

    // If cursor is provided, get messages before that cursor (older messages)
    if (cursor) {
      where.id = {
        lt: parseInt(cursor),
      }
    }

    // Get messages for this session with pagination
    // Order DESC to get latest first, then reverse in controller
    const messages = await prisma.osce_session_messages.findMany({
      where,
      orderBy: {
        id: 'desc', // Get latest first
      },
      take: limit + 1, // Get one extra to check if there's more
    })

    // Check if there are more messages
    const hasMore = messages.length > limit
    const messagesToReturn = hasMore ? messages.slice(0, limit) : messages

    // Reverse to get chronological order (oldest first)
    messagesToReturn.reverse()

    return {
      messages: messagesToReturn,
      hasMore,
      nextCursor: messagesToReturn.length > 0 ? messagesToReturn[0].id : null,
    }
  }
}
