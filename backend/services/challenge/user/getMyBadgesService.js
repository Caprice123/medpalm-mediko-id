import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetMyBadgesService {
  static async call({ userId }) {
    const sessions = await prisma.challenge_sessions.findMany({
      where: {
        user_id: userId,
        earned_badge_id: { not: null },
      },
      orderBy: { completed_at: 'desc' },
    })

    if (sessions.length === 0) return []

    const badgeIds = sessions.map(s => s.earned_badge_id)
    const challengeIds = sessions.map(s => s.challenge_id)

    const [badges, challenges] = await Promise.all([
      prisma.challenge_badges.findMany({ where: { id: { in: badgeIds } } }),
      prisma.challenges.findMany({
        where: { id: { in: challengeIds } },
        select: { id: true, title: true, end_at: true },
      }),
    ])

    const badgeMap = Object.fromEntries(badges.map(b => [b.id, b]))
    const challengeMap = Object.fromEntries(challenges.map(c => [c.id, c]))

    const results = await Promise.all(
      sessions.map(async (session) => {
        const badge = badgeMap[session.earned_badge_id]
        if (!badge) return null
        const image = await attachmentService.getAttachmentWithUrl('challenge_badge', badge.id, 'image')
        const challenge = challengeMap[session.challenge_id]
        return {
          badgeUniqueId: badge.unique_id,
          name: badge.name,
          description: badge.description,
          minRank: badge.min_rank,
          maxRank: badge.max_rank,
          image: image ? { url: image.url } : null,
          finalRank: session.final_rank,
          score: session.score,
          completedAt: session.completed_at,
          challengeTitle: challenge?.title ?? null,
          challengeEndAt: challenge?.end_at ?? null,
        }
      })
    )

    return results.filter(Boolean)
  }
}
