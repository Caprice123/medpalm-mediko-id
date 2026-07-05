import prisma from '#prisma/client'

export class GetUserChallengesService {
  static async call({ userId, page = 1, perPage = 20, search, tab = 'ongoing', universityId, semesterId }) {
    const p = parseInt(page)
    const pp = parseInt(perPage)
    const now = new Date()

    let where = { is_deleted: false }

    if (tab === 'ongoing') {
      where.status = 'active'
      where.AND = [{ start_at: { lte: now } }]
      where.AND = [{ end_at: { gte: now } }]
    } else if (tab === 'upcoming') {
      where.status = 'active'
      where.start_at = { gt: now }
    } else if (tab === 'past') {
      where.AND = [
        { status: 'completed' },
      ]
    }

    if (search) where.title = { contains: search, mode: 'insensitive' }

    const tagAndConditions = []
    if (universityId) tagAndConditions.push({ challenge_tags: { some: { tag_id: parseInt(universityId) } } })
    if (semesterId) tagAndConditions.push({ challenge_tags: { some: { tag_id: parseInt(semesterId) } } })
    if (tagAndConditions.length > 0) {
      where.AND = [...(where.AND || []), ...tagAndConditions]
    }

    const data = await prisma.challenges.findMany({
      where,
      orderBy: tab === 'past' ? { end_at: 'desc' } : { start_at: 'asc' },
      take: pp + 1,
      skip: (p - 1) * pp,
      include: {
        challenge_tags: { include: { tags: { include: { tag_group: true } } } },
      },
    })

    const isLastPage = data.length <= pp
    const sliced = data.slice(0, pp)

    const sessions = await prisma.challenge_sessions.findMany({
      where: { challenge_id: { in: sliced.map(c => c.id) }, user_id: userId },
      select: { challenge_id: true, status: true, score: true, correct_count: true },
    })

    const sessionMap = Object.fromEntries(sessions.map(s => [s.challenge_id, s]))

    return {
      data: sliced.map(c => ({ ...c, mySession: sessionMap[c.id] || null, playedCount: c.participant_count })),
      pagination: { page: p, perPage: pp, isLastPage },
    }
  }
}
