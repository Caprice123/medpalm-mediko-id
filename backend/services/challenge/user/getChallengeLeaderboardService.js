import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'
import { LeaderboardCacheService } from '#services/challenge/leaderboardCacheService'

export class GetChallengeLeaderboardService {
  static async call({ challengeUniqueId, userId, limit = null }) {
    const challenge = await prisma.challenges.findUnique({
      where: { unique_id: challengeUniqueId },
      select: { id: true, is_deleted: true, scoring_type: true, status: true, end_at: true, total_questions: true, participant_count: true },
    })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const isCompleted = challenge.status === 'completed'

    let leaderboard
    let myRank = null
    let mySessionData = null

    if (isCompleted) {
      const allSessions = await prisma.challenge_sessions.findMany({
        where: { challenge_id: challenge.id, status: 'completed' },
        orderBy: [{ final_rank: 'asc' }],
        ...(limit ? { take: limit } : {}),
      })
      const userIds = allSessions.map(s => s.user_id)
      const users = await prisma.users.findMany({
        where: { id: { in: userIds } },
        select: { id: true, name: true },
      })
      const userMap = Object.fromEntries(users.map(u => [u.id, u]))

      leaderboard = allSessions.map(session => ({
        rank: session.final_rank,
        score: session.score,
        correctCount: session.correct_count,
        totalTimeSeconds: session.total_time_seconds,
        isMe: session.user_id === userId,
        userName: userMap[session.user_id]?.name || 'Pengguna',
      }))

      mySessionData = allSessions.find(s => s.user_id === userId)
        ?? await prisma.challenge_sessions.findFirst({
          where: { challenge_id: challenge.id, user_id: userId, status: 'completed' },
          select: { final_rank: true },
        })
        ?? null
      myRank = mySessionData?.final_rank ?? null
    } else {
      let usedCache = false

      try {
        let cached = await LeaderboardCacheService.getLeaderboard({ challengeId: challenge.id, limit })

        if (!cached) {
          const dbSessions = await prisma.challenge_sessions.findMany({
            where: { challenge_id: challenge.id, status: 'completed' },
            orderBy: [{ score: 'desc' }],
          })
          if (dbSessions.length) {
            await LeaderboardCacheService.warmCache({
              challengeId: challenge.id,
              scoringType: challenge.scoring_type,
              endAt: challenge.end_at,
              sessions: dbSessions,
            })
            cached = await LeaderboardCacheService.getLeaderboard({ challengeId: challenge.id, limit })
          }
          mySessionData = dbSessions.find(s => s.user_id === userId) || null
        } else {
          const userInCache = cached.find(e => e.userId === userId)
          mySessionData = userInCache
            ? await prisma.challenge_sessions.findFirst({
                where: { challenge_id: challenge.id, user_id: userId, status: 'completed' },
              })
            : null
        }

        const cachedEntries = cached || []
        const userIds = cachedEntries.map(e => e.userId)
        const users = userIds.length
          ? await prisma.users.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
          : []
        const userMap = Object.fromEntries(users.map(u => [u.id, u]))

        leaderboard = cachedEntries.map(entry => ({
          rank: entry.rank,
          score: entry.score,
          correctCount: entry.correctCount,
          totalTimeSeconds: entry.totalTime,
          isMe: entry.userId === userId,
          userName: userMap[entry.userId]?.name || 'Pengguna',
        }))

        myRank = await LeaderboardCacheService.getRank({ challengeId: challenge.id, userId })
        usedCache = true
      } catch (err) {
        console.warn('[leaderboard] Redis unavailable, falling back to DB:', err.message)
      }

      if (!usedCache) {
        leaderboard = await this.getLeaderboardFromDB({ challengeId: challenge.id, userId })
        mySessionData = await prisma.challenge_sessions.findFirst({
          where: { challenge_id: challenge.id, user_id: userId, status: 'completed' },
        })
        const myEntry = leaderboard.find(e => e.isMe)
        myRank = myEntry?.rank ?? null
      }
    }

    // Determine myBadge by rank
    let myBadge = null
    if (myRank) {
      const badges = await prisma.challenge_badges.findMany({
        where: { challenge_id: challenge.id },
        orderBy: { min_rank: 'asc' },
      })
      const earnedBadge = badges.find(b => myRank >= b.min_rank && myRank <= b.max_rank)
      if (earnedBadge) {
        const image = await attachmentService.getAttachmentWithUrl('challenge_badge', earnedBadge.id, 'image')
        myBadge = { ...earnedBadge, image }
      }
    }

    return { leaderboard, myRank, myBadge, totalQuestions: challenge.total_questions, badgesDisbursed: isCompleted, totalParticipants: challenge.participant_count }
  }

  static async getLeaderboardFromDB({ challengeId, userId }) {
    const sessions = await prisma.challenge_sessions.findMany({
      where: { challenge_id: challengeId, status: 'completed' },
      orderBy: [{ score: 'desc' }],
    })
    const userIds = sessions.map(s => s.user_id)
    const users = userIds.length
      ? await prisma.users.findMany({ where: { id: { in: userIds } }, select: { id: true, name: true } })
      : []
    const userMap = Object.fromEntries(users.map(u => [u.id, u]))

    let rank = 1
    return sessions.map((s, idx) => {
      if (idx > 0 && s.score !== sessions[idx - 1].score) rank = idx + 1
      return {
        rank,
        score: s.score,
        correctCount: s.correct_count,
        totalTimeSeconds: s.total_time_seconds,
        isMe: s.user_id === userId,
        userName: userMap[s.user_id]?.name || 'Pengguna',
      }
    })
  }
}
