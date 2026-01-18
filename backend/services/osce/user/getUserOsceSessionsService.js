import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserOsceSessionsService extends BaseService {
  static async call(userId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    try {
      const sessions = await prisma.osce_sessions.findMany({
        where: {
          user_id: userId,
        },
        include: {
          osce_session_topic_snapshot: true,
        },
        orderBy: {
          created_at: 'desc',
        },
      })

      return sessions
    } catch (error) {
      console.error('[GetUserOsceSessionsService] Error:', error)
      throw new Error('Failed to fetch user OSCE sessions')
    }
  }
}
