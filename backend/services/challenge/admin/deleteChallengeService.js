import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class DeleteChallengeService {
  static async call(uniqueId) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: uniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    await prisma.challenges.update({
      where: { unique_id: uniqueId },
      data: { is_deleted: true, deleted_at: new Date(), updated_at: new Date() },
    })
  }
}
