import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class DeleteDiagnosticQuizService extends BaseService {
  static async call(quizId) {
    this.validate(quizId)

    // Check if quiz exists
    const quiz = await prisma.diagnostic_quizzes.findUnique({
      where: { unique_id: quizId }
    })

    // A version-2 row here is a V2 case, not a quiz — it has no title or tags and is
    // edited through the V2 case endpoints, so the V1 panel must not touch it.
    if (!quiz || quiz.version !== 1) {
      throw new ValidationError('Quiz not found')
    }

    await prisma.diagnostic_quizzes.update({
      where: { id: quiz.id },
      data: {
        is_deleted: true,
        deleted_at: new Date()
      }
    })
  }

  static validate(quizId) {
    if (!quizId || typeof quizId !== 'string') {
      throw new ValidationError('Quiz ID is required')
    }
  }
}
