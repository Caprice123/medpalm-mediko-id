import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpsertRewardService {
  static async call({ challengeUniqueId, title, description, status, imageBlobId, minRank, maxRank }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    if (!title) throw new ValidationError('Reward title is required')

    const rankData = {
      min_rank: minRank ? parseInt(minRank) : null,
      max_rank: maxRank ? parseInt(maxRank) : null,
    }

    let reward = await prisma.challenge_rewards.findFirst({ where: { challenge_id: challenge.id } })

    if (reward) {
      reward = await prisma.challenge_rewards.update({
        where: { id: reward.id },
        data: {
          title,
          description: description || null,
          status: status || 'pending',
          ...rankData,
        },
      })
    } else {
      reward = await prisma.challenge_rewards.create({
        data: {
          challenge_id: challenge.id,
          title,
          description: description || null,
          status: status || 'pending',
          ...rankData,
        },
      })
    }

    if (imageBlobId && status === 'completed') {
      await attachmentService.detachAll({ recordType: 'challenge_reward', recordId: reward.id })
      await attachmentService.attach({
        blobId: parseInt(imageBlobId),
        recordType: 'challenge_reward',
        recordId: reward.id,
        name: 'proof',
      })
    }

    return reward
  }
}
