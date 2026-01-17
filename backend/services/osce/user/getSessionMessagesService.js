import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSessionMessagesService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

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

    // Get messages for this session
    const messages = await prisma.osce_session_messages.findMany({
      where: {
        osce_session_id: session.id,
      },
      orderBy: {
        created_at: 'asc',
      },
    })

    return messages
  }
}
