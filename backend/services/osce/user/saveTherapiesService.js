import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class SaveTherapiesService extends BaseService {
  static async call(userId, sessionId, therapies) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
    }

    if (!therapies || !Array.isArray(therapies)) {
      throw new Error('Therapies must be an array')
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

      // Delete existing therapies for this session
      await prisma.osce_session_therapies.deleteMany({
        where: {
          osce_session_id: session.id,
        },
      })

      // Prepare therapies to save
      const therapiesToCreate = therapies
        .filter(therapy => therapy && therapy.trim())
        .map((therapy, index) => ({
          osce_session_id: session.id,
          therapy: therapy.trim(),
          order: index,
        }))

      // Save all therapies
      if (therapiesToCreate.length > 0) {
        await prisma.osce_session_therapies.createMany({
          data: therapiesToCreate,
        })
      }

      // Fetch and return saved therapies
      const savedTherapies = await prisma.osce_session_therapies.findMany({
        where: {
          osce_session_id: session.id,
        },
        orderBy: {
          order: 'asc',
        },
      })

      return savedTherapies
    } catch (error) {
      console.error('[SaveTherapiesService] Error:', error)
      throw error
    }
  }
}
