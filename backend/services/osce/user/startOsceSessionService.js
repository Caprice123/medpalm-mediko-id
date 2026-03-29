import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { deductUserCredits, getEffectiveCreditBalance } from '#utils/creditUtils'

export class StartOsceSessionService extends BaseService {
  static async call(userId, sessionId, sttProvider = 'whisper', supportedMimeType = null) {
    if (!userId) {
      throw new ValidationError('User ID is required')
    }

    if (!sessionId) {
      throw new ValidationError('Session ID is required')
    }

    // Validate STT provider
    if (!['deepgram', 'whisper'].includes(sttProvider)) {
      throw new ValidationError('Invalid STT provider. Must be either "deepgram" or "whisper"')
    }

      // Find the session
      const session = await prisma.osce_sessions.findFirst({
        where: {
          unique_id: sessionId,
          user_id: userId,
        },
        include: {
          osce_session_topic_snapshot: true,
        },
      })

      if (!session) {
        throw new ValidationError('Session not found or access denied')
      }

      // If session is already started, just return success
      if (session.status === 'started') {
        return
      }

      if (session.status === 'completed') {
        throw new ValidationError('Session has already been completed')
      }

      // Check OSCE feature is active and get session start cost
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['osce_practice_credit_cost'],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => {
        constantsMap[c.key] = c.value
      })

      const sessionStartCost = parseInt(constantsMap.osce_practice_credit_cost) || 10

      // Check user credits
      const balance = await getEffectiveCreditBalance(userId)

      if (balance < sessionStartCost) {
        throw new ValidationError(`Insufficient credits. You need ${sessionStartCost} credits to start a session`)
      }

      // Deduct credits and update session status
      await prisma.$transaction(async (tx) => {
        // Deduct credits
        await deductUserCredits(tx, userId, sessionStartCost, `OSCE Practice - Start session ${session.unique_id}`, session.id)

        // Update session status, credits used, and metadata
        await tx.osce_sessions.update({
          where: { id: session.id },
          data: {
            status: 'started',
            started_at: new Date(),
            scheduled_end_at: new Date(Date.now() + session.osce_session_topic_snapshot.duration_minutes * 60 * 1000),
            credits_used: sessionStartCost,
            metadata: {
              stt_provider: sttProvider,
              supported_mime_type: supportedMimeType,
            },
          },
        })
      })
  }
}
