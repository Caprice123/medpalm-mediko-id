import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetBadgesService {
  static async call(challengeUniqueId) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const badges = await prisma.challenge_badges.findMany({
      where: { challenge_id: challenge.id },
      orderBy: { min_rank: 'asc' },
    })

    return Promise.all(
      badges.map(async (badge) => {
        const image = await attachmentService.getAttachmentWithUrl('challenge_badge', badge.id, 'image')
        return { ...badge, image }
      })
    )
  }
}
