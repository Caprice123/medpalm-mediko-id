import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'

export class DeleteQuestionService {
  static async call(uniqueId) {
    const q = await prisma.challenge_questions.findUnique({ where: { unique_id: uniqueId } })
    if (!q) throw new ValidationError('Question not found')
    await prisma.$transaction([
      prisma.challenge_questions.delete({ where: { unique_id: uniqueId } }),
      prisma.challenges.update({
        where: { id: q.challenge_id },
        data: { question_pool_count: { decrement: 1 } },
      }),
    ])
  }
}
