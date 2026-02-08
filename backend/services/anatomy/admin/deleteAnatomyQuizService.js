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

    await prisma.anatomy_quizzes.delete({
        where: { unique_id: quizId }
    })

    // Delete image from iDrive E2 if exists
    if (quiz.image_key) {
        try {
            await idriveService.deleteFile(quiz.image_key)
        } catch (error) {
            console.error('Error deleting image from cloud storage:', error)
            // Continue even if image deletion fails
        }
    }
  }

  static validate(quizId) {
    if (!quizId || typeof quizId !== 'string') {
      throw new ValidationError('Quiz ID is required')
    }
  }
}
