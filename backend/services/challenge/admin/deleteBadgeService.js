import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class DeleteBadgeService {
  static async call(uniqueId) {
    const badge = await prisma.challenge_badges.findUnique({ where: { unique_id: uniqueId } })
    if (!badge) throw new ValidationError('Badge not found')

    await attachmentService.detachAll({ recordType: 'challenge_badge', recordId: badge.id })
    await prisma.challenge_badges.delete({ where: { unique_id: uniqueId } })
  }
}
