import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class DeleteUnlinkedQuestionService extends BaseService {
  static async call({ questionId }) {
    const question = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    await attachmentService.detachAll({ recordType: 'mcq_question', recordId: parseInt(questionId) })
    await prisma.mcq_questions.delete({ where: { id: parseInt(questionId) } })
  }
}
