import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import attachmentService from '#services/attachment/attachmentService'

export class CreateQuestionService {
  static async call({ challengeUniqueId, question, options, correctOptionIndex, explanation, order, isSpecial, questionImageBlobId, optionImageBlobIds }) {
    const challenge = await prisma.challenges.findUnique({ where: { unique_id: challengeUniqueId } })
    if (!challenge || challenge.is_deleted) throw new ValidationError('Challenge not found')

    if (!Array.isArray(options) || options.length < 2) throw new ValidationError('At least 2 options are required')
    if (correctOptionIndex == null || correctOptionIndex < 0 || correctOptionIndex >= options.length) {
      throw new ValidationError('Invalid correct option index')
    }

    const [q] = await prisma.$transaction([
      prisma.challenge_questions.create({
        data: {
          challenge_id: challenge.id,
          question: question || null,
          options,
          correct_option_index: parseInt(correctOptionIndex),
          explanation: explanation || null,
          order: order != null ? parseInt(order) : 0,
          is_special: Boolean(isSpecial),
        },
      }),
      prisma.challenges.update({
        where: { id: challenge.id },
        data: { question_pool_count: { increment: 1 } },
      }),
    ])

    if (questionImageBlobId) {
      await attachmentService.attach({
        blobId: parseInt(questionImageBlobId),
        recordType: 'challenge_question',
        recordId: q.id,
        name: 'question_image',
      })
    }

    if (Array.isArray(optionImageBlobIds)) {
      for (let i = 0; i < optionImageBlobIds.length; i++) {
        if (optionImageBlobIds[i]) {
          await attachmentService.attach({
            blobId: parseInt(optionImageBlobIds[i]),
            recordType: 'challenge_question',
            recordId: q.id,
            name: `option_image_${i}`,
          })
        }
      }
    }

    return q
  }
}
