import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class DeleteRewardService {
  static async call({ challengeUniqueId, rewardId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const reward = await prisma.challenge_rewards.findFirst({
      where: { id: parseInt(rewardId), challenge_id: challenge.id },
    })
    if (!reward) throw new ValidationError('Reward not found')

    await attachmentService.detachAll({ recordType: 'challenge_reward', recordId: reward.id })
    await prisma.challenge_rewards.delete({ where: { id: reward.id } })
  }
}
