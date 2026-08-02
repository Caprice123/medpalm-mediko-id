import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class SubmitMcqAnswerService extends BaseService {
  static async call({ userId, questionId }) {
    await prisma.user_learned_items.createMany({
      data: [{ user_id: userId, item_type: 'mcq_question', item_id: parseInt(questionId) }],
      skipDuplicates: true,
    })
    return { ok: true }
  }
}
