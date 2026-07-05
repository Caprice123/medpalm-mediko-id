import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class CreateRewardService {
  static async call({ challengeUniqueId, title, description, minRank, maxRank }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')
    if (!title) throw new ValidationError('Reward title is required')

    return prisma.challenge_rewards.create({
      data: {
        challenge_id: challenge.id,
        title,
        description: description || null,
        status: 'pending',
        min_rank: minRank ? parseInt(minRank) : null,
        max_rank: maxRank ? parseInt(maxRank) : null,
      },
    })
  }
}
