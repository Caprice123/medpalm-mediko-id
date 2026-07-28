import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class DeleteAnatomyQuizV2Service extends BaseService {
  static async call(quizId) {
    if (!quizId || typeof quizId !== 'string') throw new ValidationError('Quiz ID wajib diisi')

    const quiz = await prisma.anatomy_quizzes.findUnique({ where: { unique_id: quizId } })
    if (!quiz) throw new ValidationError('Quiz tidak ditemukan')

    await prisma.anatomy_quizzes.update({
      where: { id: quiz.id },
      data: { is_deleted: true, deleted_at: new Date() },
    })
  }
}
