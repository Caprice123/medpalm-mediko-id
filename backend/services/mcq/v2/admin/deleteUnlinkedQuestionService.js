import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteUnlinkedQuestionService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question || question.is_deleted) throw new ValidationError('Pertanyaan tidak ditemukan')

    await prisma.mcq_questions.update({
      where: { id: parseInt(questionId) },
      data: { is_deleted: true, deleted_at: new Date() },
    })
  }
}
