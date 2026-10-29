import prisma from '#prisma/client'

// How far ahead the landing page is willing to advertise a challenge that has
// not started yet.
const UPCOMING_WINDOW_DAYS = 7

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
    } else if (tab === 'ongoing_or_upcoming') {
      // Running now, or starting within the next week. What the landing page
      // asks for: a challenge a month out is not news it needs to carry.
      //
      // Written as one AND array rather than as sibling `where` keys because
      // both halves have to tolerate a null date — no end date means it never
      // closes, no start date means it has already started.
      const horizon = new Date(now.getTime() + UPCOMING_WINDOW_DAYS * 24 * 60 * 60 * 1000)
      where.status = 'active'
      where.AND = [
        { OR: [{ end_at: null }, { end_at: { gte: now } }] },
        { OR: [{ start_at: null }, { start_at: { lte: horizon } }] },
      ]
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

    // No user means an anonymous caller — the landing page reads this listing
    // without a login. The query is skipped rather than filtered: `user_id` is
    // a non-nullable column, so Prisma rejects a null filter outright, and
    // leaving it undefined would drop the condition and match every user's
    // sessions. Same guard the event and webinar listings already use.
    const sessions = userId
      ? await prisma.challenge_sessions.findMany({
          where: { challenge_id: { in: sliced.map(c => c.id) }, user_id: userId },
          select: { challenge_id: true, status: true, score: true, correct_count: true },
        })
      : []

    const sessionMap = Object.fromEntries(sessions.map(s => [s.challenge_id, s]))

    return {
      data: sliced.map(c => ({ ...c, mySession: sessionMap[c.id] || null, playedCount: c.participant_count })),
      pagination: { page: p, perPage: pp, isLastPage },
    }
  }
}
