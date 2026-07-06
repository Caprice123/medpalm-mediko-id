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
      // Auto-complete any sessions still in_progress when the challenge ended
      const inProgressSessions = await prisma.challenge_sessions.findMany({
        where: { challenge_id: challenge.id, status: 'in_progress' },
      })

      for (const session of inProgressSessions) {
        const answers = await prisma.challenge_session_answers.findMany({
          where: { session_id: session.id },
        })
        let correctCount = 0
        let totalTime = 0
        for (const ans of answers) {
          if (ans.is_correct) correctCount++
          totalTime += ans.time_taken_seconds ?? 0
        }
        await prisma.challenge_sessions.update({
          where: { id: session.id },
          data: {
            status: 'completed',
            score: session.score ?? 0,
            correct_count: correctCount,
            total_time_seconds: totalTime,
            completed_at: now,
          },
        })
      }

      const orderBy = [{ score: 'desc' }]

      const sessions = await prisma.challenge_sessions.findMany({
        where: { challenge_id: challenge.id, status: 'completed' },
        orderBy,
      })

      // Assign final_rank using standard competition ranking (1,2,2,4) — ties share the same rank
      const ranked = []
      for (let i = 0; i < sessions.length; i++) {
        const session = sessions[i]
        let rank
        if (i === 0) {
          rank = 1
        } else {
          const tied = session.score === sessions[i - 1].score
          rank = tied ? ranked[i - 1].rank : i + 1
        }
        const badge = challenge.challenge_badges.find(b => rank >= b.min_rank && rank <= b.max_rank)
        ranked.push({ session, rank, badge })
      }

      // Batch updates in chunks of 100 to avoid large transactions
      const updates = ranked.map(({ session, rank, badge }) =>
        prisma.challenge_sessions.update({
          where: { id: session.id },
          data: { final_rank: rank, earned_badge_id: badge?.id ?? null },
        })
      )
      for (let i = 0; i < updates.length; i += 100) {
        await prisma.$transaction(updates.slice(i, i + 100))
      }

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
