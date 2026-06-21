import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class GetChallengeDetailService {
  static async call({ challengeUniqueId, userId }) {
    const challenge = await prisma.challenges.findUnique({
      where: { unique_id: challengeUniqueId },
      include: {
        _count: { select: { challenge_questions: true } },
        challenge_tags: { include: { tags: { include: { tag_group: true } } } },
      },
    })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const completedSession = await prisma.challenge_sessions.findFirst({
      where: { challenge_id: challenge.id, user_id: userId, status: 'completed' },
    })

    let activeSession = null
    if (!completedSession) {
      const inProgress = await prisma.challenge_sessions.findFirst({
        where: { challenge_id: challenge.id, user_id: userId, status: 'in_progress' },
      })
      if (inProgress) activeSession = { sessionUniqueId: inProgress.unique_id, startedAt: inProgress.started_at }
    }

    return { challenge, mySession: completedSession, activeSession }
  }
}
