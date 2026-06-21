import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class CreateBadgeService {
  static async call({ challengeUniqueId, name, description, minRank, maxRank, imageBlobId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    if (!name) throw new ValidationError('Badge name is required')
    if (minRank == null || maxRank == null) throw new ValidationError('Rank range is required')
    if (parseInt(minRank) > parseInt(maxRank)) throw new ValidationError('min_rank cannot be greater than max_rank')

    const badge = await prisma.challenge_badges.create({
      data: {
        challenge_id: challenge.id,
        name,
        description: description || null,
        min_rank: parseInt(minRank),
        max_rank: parseInt(maxRank),
      },
    })

    if (imageBlobId) {
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'challenge_badge',
        recordId: badge.id,
        name: 'image',
      })
    }

    return badge
  }
}
