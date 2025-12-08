import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import idriveService from '../../idrive.service.js'

export class DeleteAnatomyQuizService extends BaseService {
  static async call(quizId, hardDelete = false) {
    this.validate(quizId)

    // Check if quiz exists
    const quiz = await prisma.anatomy_quizzes.findUnique({
      where: { id: parseInt(quizId) }
    })

    if (!quiz) {
      throw new ValidationError('Quiz not found')
    }

    if (hardDelete) {
      // Hard delete: remove quiz and associated data (cascade will handle questions and tags)
      await prisma.anatomy_quizzes.delete({
        where: { id: parseInt(quizId) }
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
    } else {
      // Soft delete: set is_active to false
      await prisma.anatomy_quizzes.update({
        where: { id: parseInt(quizId) },
        data: {
          is_active: false
        }
      })
    }

    return { success: true, deleted: hardDelete ? 'permanently' : 'soft' }
  }

  static validate(quizId) {
    if (!quizId) {
      throw new ValidationError('Quiz ID is required')
    }

    const id = parseInt(quizId)
    if (isNaN(id) || id <= 0) {
      throw new ValidationError('Invalid quiz ID')
    }
  }
}
