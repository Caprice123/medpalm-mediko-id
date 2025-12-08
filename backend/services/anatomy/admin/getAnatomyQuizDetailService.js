import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'
import idriveService from '../../idrive.service.js'

export class GetAnatomyQuizDetailService extends BaseService {
  static async call(quizId) {
    this.validate(quizId)

    const quiz = await prisma.anatomy_quizzes.findUnique({
      where: { id: parseInt(quizId) },
      include: {
        anatomy_questions: {
          orderBy: { order: 'asc' }
        },
        anatomy_quiz_tags: {
          include: {
            tags: true
          }
        }
      }
    })

    if (!quiz) {
      throw new ValidationError('Quiz not found')
    }

    // Transform tags to simpler format
    const transformedQuiz = {
      ...quiz,
      image_url: await idriveService.getSignedUrl(quiz.image_key),
      tags: quiz.anatomy_quiz_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id
      }))
    }

    return transformedQuiz
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
