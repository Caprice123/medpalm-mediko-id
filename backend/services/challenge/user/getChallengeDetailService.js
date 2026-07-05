import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'

export class GetChallengeDetailService {
  static async call({ challengeUniqueId, userId }) {
    const challenge = await prisma.challenges.findUnique({
      where: { unique_id: challengeUniqueId },
      include: {
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

    // Compute user's rank for eligibility check
    let myRank = null
    if (completedSession) {
      if (challenge.status === 'completed') {
        myRank = completedSession.final_rank ?? null
      } else {
        try {
          myRank = await LeaderboardCacheService.getRank({ challengeId: challenge.id, userId })
        } catch {
          // Redis unavailable — fall back to DB count
          const better = await prisma.challenge_sessions.count({
            where: {
              challenge_id: challenge.id,
              status: 'completed',
              OR: [
                { score: { gt: completedSession.score } },
                { score: completedSession.score, total_time_seconds: { lt: completedSession.total_time_seconds } },
              ],
            },
          })
          myRank = better + 1
        }
      }
    }

    const rewards = await prisma.challenge_rewards.findMany({
      where: { challenge_id: challenge.id },
      orderBy: [{ min_rank: 'asc' }, { id: 'asc' }],
    })

    let rewardWithProof = null
    if (completedSession) {
      const disbursement = await prisma.challenge_reward_disbursements.findFirst({
        where: { challenge_session_id: completedSession.id },
        include: { challenge_rewards: true },
      })

      if (disbursement) {
        const proof = await attachmentService.getAttachmentWithUrl('challenge_reward_disbursement', disbursement.id, 'proof')
        rewardWithProof = { ...disbursement.challenge_rewards, disbursementStatus: disbursement.status, proof }
      }
    }

    return {
      challenge,
      mySession: completedSession,
      activeSession,
      rewards,
      reward: rewardWithProof,
      rewardRead: completedSession?.reward_read ?? false,
    }
  }
}
