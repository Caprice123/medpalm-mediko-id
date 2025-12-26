import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

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

    // Get attachment with URL
    const attachment = await attachmentService.getAttachmentWithUrl(
      'anatomy_quiz',
      quiz.id,
      'image'
    )

    // Transform tags to simpler format
    const transformedQuiz = {
      ...quiz,
      blobId: attachment?.blobId || null,
      image_url: attachment?.url || null,
      image_key: attachment?.blob?.key || null,
      image_filename: attachment?.blob?.filename || null,
      image_size: attachment?.blob?.byteSize || null,
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
