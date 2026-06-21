import prisma from '#prisma/client'

export class GetChallengesService {
  static async call({ page = 1, perPage = 20, status, search, scoringType, universityId, semesterId } = {}) {
    const p = parseInt(page)
    const pp = parseInt(perPage)
    const where = { is_deleted: false }

    if (status) where.status = status
    if (scoringType) where.scoring_type = scoringType
    if (search) where.title = { contains: search, mode: 'insensitive' }

    const tagAndConditions = []
    if (universityId) tagAndConditions.push({ challenge_tags: { some: { tag_id: parseInt(universityId) } } })
    if (semesterId) tagAndConditions.push({ challenge_tags: { some: { tag_id: parseInt(semesterId) } } })
    if (tagAndConditions.length > 0) {
      where.AND = [...(where.AND || []), ...tagAndConditions]
    }

    const [data, total] = await Promise.all([
      prisma.challenges.findMany({
        where,
        orderBy: { created_at: 'desc' },
        take: pp + 1,
        skip: (p - 1) * pp,
        include: {
          _count: { select: { challenge_questions: true, challenge_sessions: true } },
          challenge_tags: { include: { tags: { include: { tag_group: true } } } },
        },
      }),
      prisma.challenges.count({ where }),
    ])

    const isLastPage = data.length <= pp
    return {
      data: data.slice(0, pp),
      pagination: { page: p, perPage: pp, isLastPage, total },
    }
  }
}
