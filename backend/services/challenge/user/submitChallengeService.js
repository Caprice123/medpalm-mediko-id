import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'
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

    // Read answers from DB — trusted source
    const savedAnswers = await prisma.challenge_session_answers.findMany({
      where: { session_id: session.id },
      include: { challenge_question: { select: { id: true, is_special: true, correct_option_index: true, question: true, options: true, explanation: true } } },
    })

    const questionIds = session.question_ids
    const questionMap = Object.fromEntries(
      await prisma.challenge_questions.findMany({
        where: { id: { in: questionIds } },
        select: { id: true, question: true, options: true, correct_option_index: true, explanation: true, is_special: true },
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

    // Write to Redis leaderboard; warm from DB if cold
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

    const rank = await LeaderboardCacheService.getRank({ challengeId: challenge.id, userId })
    const totalParticipants = await LeaderboardCacheService.getCount({ challengeId: challenge.id })

    const badges = await prisma.challenge_badges.findMany({
      where: { challenge_id: challenge.id },
      orderBy: { min_rank: 'asc' },
    })
    const earnedBadge = badges.find(b => rank >= b.min_rank && rank <= b.max_rank) || null
    let earnedBadgeWithImage = null
    if (earnedBadge) {
      const image = await attachmentService.getAttachmentWithUrl('challenge_badge', earnedBadge.id, 'image')
      earnedBadgeWithImage = { ...earnedBadge, image }
    }

    const review = questionIds.map((qId) => {
      const q = questionMap[qId]
      const ans = answerMap[qId]
      return {
        question: q?.question,
        options: q?.options,
        isSpecial: q?.is_special ?? false,
        correctOptionIndex: q?.correct_option_index,
        selectedOptionIndex: ans?.selected_option_index ?? null,
        isCorrect: ans?.is_correct ?? false,
        timeTakenSeconds: ans?.time_taken_seconds ?? 0,
        explanation: q?.explanation || null,
      }
    })

    return {
      score: totalScore,
      correctCount,
      totalQuestions: questionIds.length,
      answeredCount: savedAnswers.length,
      totalTimeSeconds: totalTime,
      rank,
      totalParticipants,
      scoringType: challenge.scoring_type,
      earnedBadge: earnedBadgeWithImage,
      review,
    }
  }
}
