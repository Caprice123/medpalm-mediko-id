import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'
import { getScoringStrategy } from '#services/challenge/scoring/index'

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

    const questionIds = session.question_ids
    const questionMap = Object.fromEntries(
      await prisma.challenge_questions.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, is_special: true },
      }).then(qs => qs.map(q => [q.id, q]))
    )

    const answerMap = Object.fromEntries(savedAnswers.map(a => [a.question_id, a]))

    const scoring = getScoringStrategy(challenge.scoring_type)
    const { totalScore, correctCount, totalTime } = scoring.calculate({
      challenge,
      questionIds,
      questionMap,
      answerMap,
    })

    await prisma.challenge_sessions.update({
      where: { id: session.id },
      data: {
        status: 'completed',
        score: totalScore,
        correct_count: correctCount,
        total_time_seconds: totalTime,
        completed_at: new Date(),
      },
    })

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
