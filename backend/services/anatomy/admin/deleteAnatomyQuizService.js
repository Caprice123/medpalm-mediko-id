import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class DeleteAnatomyQuizService extends BaseService {
  static async call(quizId) {
    this.validate(quizId)

    // Check if quiz exists
    const quiz = await prisma.anatomy_quizzes.findUnique({
      where: { unique_id: quizId }
    })

    if (!quiz) {
      throw new ValidationError('Quiz not found')
    }

    await prisma.$executeRaw`DELETE FROM anatomy_quizzes WHERE id = ${quiz.id}`
  }

  static validate(quizId) {
    if (!quizId || typeof quizId !== 'string') {
      throw new ValidationError('Quiz ID is required')
    }
  }
}
