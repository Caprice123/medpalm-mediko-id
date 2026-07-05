import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class UpdateDisbursementService {
  static async call({ challengeUniqueId, disbursementId, status, proofBlobId }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    const disbursement = await prisma.challenge_reward_disbursements.findFirst({
      where: {
        id: parseInt(disbursementId),
        challenge_rewards: { challenge_id: challenge.id },
      },
    })
    if (!disbursement) throw new ValidationError('Disbursement not found')

    const updated = await prisma.challenge_reward_disbursements.update({
      where: { id: disbursement.id },
      data: { status },
    })

    if (proofBlobId) {
      await attachmentService.detachAll({ recordType: 'challenge_reward_disbursement', recordId: disbursement.id })
      await attachmentService.attach({ blobId: proofBlobId, recordType: 'challenge_reward_disbursement', recordId: disbursement.id, name: 'proof' })
    }

    return updated
  }
}
