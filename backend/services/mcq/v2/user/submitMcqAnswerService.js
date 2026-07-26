import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class SubmitMcqAnswerService extends BaseService {
  static async call({ userId, questionId, isCorrect }) {
    await prisma.user_learned_items.create({
      data: {
        user_id: userId,
        item_type: 'mcq_question',
        item_id: parseInt(questionId),
        is_correct: Boolean(isCorrect),
      },
    })
    return { ok: true }
  }
}
