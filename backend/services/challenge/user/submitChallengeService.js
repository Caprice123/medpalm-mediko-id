import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'

export class SubmitChallengeService {
  static async call({ challengeUniqueId, userId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const session = await prisma.challenge_sessions.findFirst({
      where: { challenge_id: challenge.id, user_id: userId },
    })
    if (!session) throw new ValidationError('No active session found')
    if (session.status === 'completed') throw new ValidationError('Session already submitted')

    const savedAnswers = await prisma.challenge_session_answers.findMany({
      where: { session_id: session.id },
    })

    // Score is already accumulated accurately by saveAnswerService on each answer.
    // Only correctCount and totalTime need to be derived from the answer records.
    const now = new Date()
    const isExpired = challenge.end_at && now > challenge.end_at
    const totalScore = session.score ?? 0
    let correctCount = 0
    let totalTime = 0
    for (const ans of savedAnswers) {
      if (ans.is_correct) correctCount++
      totalTime += ans.time_taken_seconds ?? 0
    }

    await prisma.challenge_sessions.update({
      where: { id: session.id },
      data: {
        status: 'completed',
        score: totalScore,
        correct_count: correctCount,
        total_time_seconds: totalTime,
        completed_at: now,
      },
    })

    if (isExpired) return { ok: true }

    // Update Redis leaderboard cache so the result page gets fresh rank immediately
    try {
      const cacheCount = await LeaderboardCacheService.getCount({ challengeId: challenge.id })
      if (cacheCount === 0) {
        const existingSessions = await prisma.challenge_sessions.findMany({
          where: { challenge_id: challenge.id, status: 'completed', id: { not: session.id } },
          orderBy: [{ score: 'desc' }, { total_time_seconds: 'asc' }],
        })
        await LeaderboardCacheService.warmCache({
          challengeId: challenge.id,
          scoringType: challenge.scoring_type,
          endAt: challenge.end_at,
          sessions: existingSessions,
        })
      }

      await LeaderboardCacheService.addEntry({
        challengeId: challenge.id,
        scoringType: challenge.scoring_type,
        userId,
        score: totalScore,
        correctCount,
        totalTimeSec: totalTime,
        endAt: challenge.end_at,
      })
    } catch (err) {
      console.warn('[submit] Redis unavailable, leaderboard will be computed on next fetch:', err.message)
    }

    return { ok: true }
  }
}
