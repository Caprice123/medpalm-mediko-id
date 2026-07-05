import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetRewardService {
  static async call(challengeUniqueId) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const reward = await prisma.challenge_rewards.findFirst({ where: { challenge_id: challenge.id } })
    if (!reward) return null

    const proof = await attachmentService.getAttachmentWithUrl('challenge_reward', reward.id, 'proof')

    return { ...reward, proof }
  }
}
