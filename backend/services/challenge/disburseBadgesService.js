import prisma from '#prisma/client'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'
import { queueChallengeAnswerKeyEmail } from '#jobs/queues/emailQueue'

const OPTION_LABELS = ['A', 'B', 'C', 'D', 'E']

export class DisburseBadgesService {
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
        data: { badges_disbursed: true },
      })

      // Clean up live leaderboard cache — final_rank in DB is now the source of truth
      await LeaderboardCacheService.deleteChallenge({ challengeId: challenge.id })

      // Send answer key emails for classic challenges
      if (challenge.scoring_type === 'classic' && sessions.length > 0) {
        await this.sendAnswerKeyEmails({ challenge, sessions })
      }

      console.log(
        `✅ Badge disbursement: "${challenge.title}" — ${sessions.length} participant(s)`
      )
      disbursedCount++
    }

    return disbursedCount
  }

  static async sendAnswerKeyEmails({ challenge, sessions }) {
    const sessionIds = sessions.map(s => s.id)
    const userIds = sessions.map(s => s.user_id)

    // Fetch all answers + questions in one query
    const answers = await prisma.challenge_session_answers.findMany({
      where: { session_id: { in: sessionIds } },
      include: { challenge_question: true },
      orderBy: { challenge_question: { order: 'asc' } },
    })

    // Fetch user emails in one query
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    })
    const userMap = Object.fromEntries(users.map(u => [u.id, u]))

    // Group answers by session id
    const answersBySession = {}
    for (const a of answers) {
      if (!answersBySession[a.session_id]) answersBySession[a.session_id] = []
      answersBySession[a.session_id].push(a)
    }

    // Send one email per participant (fire-and-forget, log errors without throwing)
    await Promise.allSettled(
      sessions.map((session) => {
        const user = userMap[session.user_id]
        if (!user?.email) return Promise.resolve()

        const sessionAnswers = answersBySession[session.id] || []
        const questions = sessionAnswers.map((a, idx) => {
          const q = a.challenge_question
          const options = Array.isArray(q.options) ? q.options : []
          return {
            num: idx + 1,
            questionText: q.question || '',
            selectedOption: `${OPTION_LABELS[a.selected_option_index] ?? a.selected_option_index}. ${options[a.selected_option_index] ?? ''}`,
            correctOption: `${OPTION_LABELS[q.correct_option_index] ?? q.correct_option_index}. ${options[q.correct_option_index] ?? ''}`,
            isCorrect: a.is_correct,
            explanation: q.explanation || null,
          }
        })

        return queueChallengeAnswerKeyEmail({
          to: user.email,
          userName: user.name,
          challengeTitle: challenge.title,
          score: session.score ?? 0,
          correctCount: session.correct_count ?? 0,
          totalQuestions: questions.length,
          finalRank: session.final_rank,
          questions,
        }).catch((err) => {
          console.error(`[cron] Failed to queue answer key for ${user.email}:`, err.message)
        })
      })
    )
  }
}
