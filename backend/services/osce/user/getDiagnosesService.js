import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetDiagnosesService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
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
        throw new ValidationError('Session not found or access denied')
      }

      // Get diagnoses for this session
      const diagnoses = await prisma.osce_session_diagnoses.findMany({
        where: {
          osce_session_id: session.id,
        },
        orderBy: [
          { type: 'desc' }, // 'utama' comes before 'pembanding'
          { created_at: 'asc' },
        ],
      })

      return diagnoses
    } catch (error) {
      console.error('[GetDiagnosesService] Error:', error)
      throw error
    }
  }
}
