import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class GetAdminLeaderboardService {
  static async call({ challengeUniqueId, page = 1, perPage = 50 }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const p = parseInt(page)
    const pp = parseInt(perPage)

    const orderBy = challenge.scoring_type === 'classic'
      ? [{ score: 'desc' }, { total_time_seconds: 'asc' }]
      : [{ score: 'desc' }]

    const sessions = await prisma.challenge_sessions.findMany({
      where: { challenge_id: challenge.id, status: 'completed' },
      orderBy,
      take: pp + 1,
      skip: (p - 1) * pp,
    })

    const isLastPage = sessions.length <= pp
    const sliced = sessions.slice(0, pp)

    const userIds = sliced.map(s => s.user_id)
    const users = await prisma.users.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    })
    const userMap = Object.fromEntries(users.map(u => [u.id, u]))

    const offset = (p - 1) * pp
    const data = sliced.map((session, idx) => ({
      rank: offset + idx + 1,
      score: session.score,
      correctCount: session.correct_count,
      totalTimeSeconds: session.total_time_seconds,
      completedAt: session.completed_at,
      user: userMap[session.user_id] ? {
        id: userMap[session.user_id].id,
        name: userMap[session.user_id].name,
        email: userMap[session.user_id].email,
      } : null,
    }))

    return { data, pagination: { page: p, perPage: pp, isLastPage } }
  }
}
