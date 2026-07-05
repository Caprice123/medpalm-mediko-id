import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateRewardService {
  static async call({ challengeUniqueId, rewardId, title, description, minRank, maxRank, status, imageBlobId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const reward = await prisma.challenge_rewards.findFirst({
      where: { id: parseInt(rewardId), challenge_id: challenge.id },
    })
    if (!reward) throw new ValidationError('Reward not found')
    if (title !== undefined && !title) throw new ValidationError('Reward title is required')

    const updated = await prisma.challenge_rewards.update({
      where: { id: reward.id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description: description || null }),
        ...(status !== undefined && { status }),
        ...(minRank !== undefined && { min_rank: minRank ? parseInt(minRank) : null }),
        ...(maxRank !== undefined && { max_rank: maxRank ? parseInt(maxRank) : null }),
      },
    })

    if (imageBlobId) {
      await attachmentService.detachAll({ recordType: 'challenge_reward', recordId: reward.id })
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'challenge_reward',
        recordId: reward.id,
        name: 'proof',
      })
    }

    return updated
  }
}
