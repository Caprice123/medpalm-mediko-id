import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateBadgeService {
  static async call({ uniqueId, name, description, minRank, maxRank, imageBlobId }) {
    const badge = await prisma.challenge_badges.findUnique({ where: { unique_id: uniqueId } })
    if (!badge) throw new ValidationError('Badge not found')

    const newMin = minRank != null ? parseInt(minRank) : badge.min_rank
    const newMax = maxRank != null ? parseInt(maxRank) : badge.max_rank
    if (newMin > newMax) throw new ValidationError('min_rank cannot be greater than max_rank')

    const updated = await prisma.challenge_badges.update({
      where: { unique_id: uniqueId },
      data: {
        name: name ?? badge.name,
        description: description !== undefined ? description : badge.description,
        min_rank: newMin,
        max_rank: newMax,
        updated_at: new Date(),
      },
    })

    if (imageBlobId) {
      await attachmentService.detachAll({ recordType: 'challenge_badge', recordId: badge.id })
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'challenge_badge',
        recordId: badge.id,
        name: 'image',
      })
    }

    return updated
  }
}
