import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class StartOsceSessionService extends BaseService {
  static async call(userId, sessionId) {
    if (!userId) {
      throw new Error('User ID is required')
    }

    if (!sessionId) {
      throw new Error('Session ID is required')
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
        throw new Error('Session not found or access denied')
      }

      // If session is already started, just return success
      if (session.status === 'started') {
        return 
      }

      if (session.status === 'completed') {
        throw new Error('Session has already been completed')
      }

      // Check OSCE feature is active and get session start cost
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: ['osce_practice_is_active', 'osce_session_start_cost'],
          },
        },
      })

      const constantsMap = {}
      constants.forEach(c => {
        constantsMap[c.key] = c.value
      })

      const featureActive = constantsMap.osce_practice_is_active === 'true'
      if (!featureActive) {
        throw new Error('OSCE Practice feature is currently inactive')
      }

      const sessionStartCost = parseInt(constantsMap.osce_session_start_cost) || 10

      // Check user credits
      const userCredit = await prisma.user_credits.findUnique({
        where: { user_id: userId },
      })

      if (!userCredit || userCredit.balance < sessionStartCost) {
        throw new Error(`Insufficient credits. You need ${sessionStartCost} credits to start a session`)
      }

      // Deduct credits and update session status
      await prisma.$transaction(async (tx) => {
        // Deduct credits
        await tx.user_credits.update({
          where: { user_id: userId },
          data: {
            balance: { decrement: sessionStartCost },
          },
        })

        // Record credit transaction
        await tx.credit_transactions.create({
          data: {
            user_id: userId,
            user_credit_id: userCredit.id,
            type: 'deduction',
            amount: sessionStartCost,
            balance_before: userCredit.balance,
            balance_after: userCredit.balance - sessionStartCost,
            description: `OSCE Practice - Start session ${session.unique_id}`,
            session_id: session.id,
          },
        })

        // Update session status and credits used
        await tx.osce_sessions.update({
          where: { id: session.id },
          data: {
            status: 'started',
            started_at: new Date(),
            scheduled_end_at: new Date(Date.now() + session.osce_session_topic_snapshot.duration_minutes * 60 * 1000),
            credits_used: sessionStartCost,
          },
        })
      })
  }
}
