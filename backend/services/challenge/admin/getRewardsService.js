import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRewardsService {
  static async call(challengeUniqueId) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const rewards = await prisma.challenge_rewards.findMany({
      where: { challenge_id: challenge.id },
      orderBy: [{ min_rank: 'asc' }, { id: 'asc' }],
    })

    return await Promise.all(rewards.map(async (r) => {
      const proof = await attachmentService.getAttachmentWithUrl('challenge_reward', r.id, 'proof')
      return { ...r, proof }
    }))
  }
}
