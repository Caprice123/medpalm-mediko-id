import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetTherapiesService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    try {
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

      // Get therapies for this session
      const therapies = await prisma.osce_session_therapies.findMany({
        where: {
          osce_session_id: session.id,
        },
        orderBy: {
          order: 'asc',
        },
      })

      return therapies
    } catch (error) {
      console.error('[GetTherapiesService] Error:', error)
      throw error
    }
  }
}
