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
          osce_topic: {
            select: {
              id: true,
              title: true,
              description: true,
              scenario: true,
              duration_minutes: true,
            },
          },
          osce_session_observations: {
            select: {
              id: true,
              observation_id: true,
              is_checked: true,
              ai_comment: true,
            },
          },
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
