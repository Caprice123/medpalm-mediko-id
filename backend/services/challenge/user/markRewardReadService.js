import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class MarkRewardReadService {
  static async call({ challengeUniqueId, userId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const session = await prisma.challenge_sessions.findFirst({
      where: { challenge_id: challenge.id, user_id: userId, status: 'completed' },
    })
    if (!session) return null

    await prisma.challenge_sessions.update({
      where: { id: session.id },
      data: { reward_read: true },
    })
  }
}
