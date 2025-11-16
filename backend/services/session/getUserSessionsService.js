import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetUserSessionsService extends BaseService {
  static async call({ userId, status = null, limit = 30, offset = 0 }) {
    // Build where clause
    const where = {
        user_id: parseInt(userId)
    }

    if (status) {
        where.status = status
    }

    // Fetch limit + 1 to check if there are more results
    const sessions = await prisma.user_learning_sessions.findMany({
        where,
        orderBy: {
            id: 'desc'
        },
        take: parseInt(limit) + 1,
        skip: parseInt(offset)
    })

    // Check if there are more results
    const hasMore = sessions.length > limit
    const isLastPage = !hasMore

    // Get only the requested number of sessions (exclude the extra one)
    const sessionsToReturn = hasMore ? sessions.slice(0, limit) : sessions

    return {
      data: sessionsToReturn,
      pagination: {
        limit: parseInt(limit),
        offset: parseInt(offset),
        isLastPage: isLastPage
      }
    }
  }
}
