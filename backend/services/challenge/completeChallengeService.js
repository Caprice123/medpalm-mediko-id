import prisma from '#prisma/client'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'
import { queueChallengeAnswerKeyEmail } from '#jobs/queues/emailQueue'

export class CompleteChallengeService {
  static async call() {
    const now = new Date()

    // Find active challenges whose end_at has passed and badges not yet locked in
    const challenges = await prisma.challenges.findMany({
      where: {
        is_deleted: false,
        badges_disbursed: false,
        status: 'active',
        end_at: { lte: now },
      },
      include: {
        challenge_badges: { orderBy: { min_rank: 'asc' } },
      },
    })

    let disbursedCount = 0

    for (const challenge of challenges) {
      const orderBy = challenge.scoring_type === 'classic'
        ? [{ score: 'desc' }, { total_time_seconds: 'asc' }]
        : [{ score: 'desc' }]

      const sessions = await prisma.challenge_sessions.findMany({
        where: { challenge_id: challenge.id, status: 'completed' },
        orderBy,
      })

      // Assign final_rank and earned_badge_id to every completed session
      await prisma.$transaction(
        sessions.map((session, idx) => {
          const rank = idx + 1
          const badge = challenge.challenge_badges.find(
            b => rank >= b.min_rank && rank <= b.max_rank
          )
          return prisma.challenge_sessions.update({
            where: { id: session.id },
            data: {
              final_rank: rank,
              earned_badge_id: badge?.id ?? null,
            },
          })
        })
      )

      await prisma.challenges.update({
        where: { id: challenge.id },
        data: { badges_disbursed: true, status: 'completed' },
      })

      // Create reward disbursement records for eligible sessions
      const rewards = await prisma.challenge_rewards.findMany({
        where: { challenge_id: challenge.id },
      })
      if (rewards.length > 0) {
        const rankedSessions = await prisma.challenge_sessions.findMany({
          where: { challenge_id: challenge.id, status: 'completed', final_rank: { not: null } },
          select: { id: true, final_rank: true },
        })
        const disbursements = []
        console.log(rankedSessions)
        for (const session of rankedSessions) {
          const matched = rewards.find(r =>
            (r.min_rank === null && r.max_rank === null) ||
            (session.final_rank >= (r.min_rank ?? 1) && session.final_rank <= (r.max_rank ?? Infinity))
          )
          if (matched) {
            disbursements.push({ challenge_reward_id: matched.id, challenge_session_id: session.id })
          }
        }
        if (disbursements.length > 0) {
          await prisma.challenge_reward_disbursements.createMany({
            data: disbursements,
            skipDuplicates: true,
          })
        }
      }

      // Clean up live leaderboard cache — final_rank in DB is now the source of truth
      await LeaderboardCacheService.deleteChallenge({ challengeId: challenge.id })

      if (sessions.length > 0) {
        await this.sendAnswerKeyEmails({ sessions })
      }

      console.log(
        `✅ Challenge completed: "${challenge.title}" — ${sessions.length} participant(s)`
      )
      disbursedCount++
    }

    return disbursedCount
  }

  static async sendAnswerKeyEmails({ sessions }) {
    await Promise.allSettled(
      sessions.map((session) =>
        queueChallengeAnswerKeyEmail({ sessionId: session.id }).catch((err) => {
          console.error(`[worker] Failed to queue answer key for session ${session.id}:`, err.message)
        })
      )
    )
  }
}
