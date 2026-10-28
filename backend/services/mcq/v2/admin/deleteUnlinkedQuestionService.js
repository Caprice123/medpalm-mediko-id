import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { decrementContentStat, CONTENT_STAT_KEYS } from '#utils/contentStatsHelper'

export class DeleteUnlinkedQuestionService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question || question.is_deleted) throw new ValidationError('Pertanyaan tidak ditemukan')

    await prisma.mcq_questions.update({
      where: { id: parseInt(questionId) },
      data: { is_deleted: true, deleted_at: new Date() },
    })

    // The guard above already rejected an already-deleted question, so this
    // can only run once per question.
    await decrementContentStat(CONTENT_STAT_KEYS.mcqQuestion)
  }
}
