import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class GetDisbursementsService {
  static async call(challengeUniqueId) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const rewards = await prisma.challenge_rewards.findMany({
      where: { challenge_id: challenge.id },
      orderBy: [{ min_rank: 'asc' }, { id: 'asc' }],
    })

    return await Promise.all(rewards.map(async (reward) => {
      const proof = await attachmentService.getAttachmentWithUrl('challenge_reward', reward.id, 'proof')

      const disbursements = await prisma.challenge_reward_disbursements.findMany({
        where: { challenge_reward_id: reward.id },
        include: {
          challenge_sessions: {
            include: { users: { select: { id: true, name: true, email: true } } },
          },
        },
        orderBy: { created_at: 'asc' },
      })

      const disbursementsWithProof = await Promise.all(
        disbursements.map(async (d) => {
          const disbursementProof = await attachmentService.getAttachmentWithUrl('challenge_reward_disbursement', d.id, 'proof')
          return { ...d, proof: disbursementProof }
        })
      )

      return {
        reward: { ...reward, proof },
        disbursements: disbursementsWithProof,
      }
    }))
  }
}
