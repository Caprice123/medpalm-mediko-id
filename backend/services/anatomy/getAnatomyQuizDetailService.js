import { ValidationError } from '#errors/validationError'
import { AuthorizationError } from '#errors/authorizationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

export class GetAnatomyQuizDetailService extends BaseService {
  static async call(quizId, { userId, userRole = 'user' } = {}) {
    this.validate(quizId)

    const quiz = await prisma.$transaction(async (tx) => {
      const quiz = await tx.anatomy_quizzes.findUnique({
        where: { unique_id: quizId },
        include: {
          anatomy_questions: {
            orderBy: { order: 'asc' }
          },
          anatomy_quiz_tags: {
            include: {
              tags: {
                include: {
                  tag_group: true
                }
              }
            }
          }
        }
      })

      if (!quiz || quiz.is_deleted) {
        throw new ValidationError('Quiz not found')
      }

      if (userRole === 'user' && quiz.status !== 'published') {
        throw new AuthorizationError('This quiz is not available')
      }

      await checkAccessAndDeductCredit(tx, {
        userId,
        userRole,
        accessTypeKey: 'anatomy_access_type',
        creditCostKey: 'anatomy_quiz_cost',
        description: `Viewed anatomy quiz: ${quiz.id} - ${quiz.title}`
      })

      return quiz
    })

    const attachment = await attachmentService.getAttachmentWithUrl(
      'anatomy_quiz',
      quiz.id,
      'image'
    )

    return {
      ...quiz,
      image_url: attachment?.url || null,
      tags: quiz.anatomy_quiz_tags.map(t => ({
        id: t.tags.id,
        name: t.tags.name,
        tagGroupId: t.tags.tag_group_id,
        tagGroupName: t.tags.tag_group?.name || null
      }))
    }
  }

  static validate(quizId) {
    if (!quizId || typeof quizId !== 'string') {
      throw new ValidationError('Quiz ID is required')
    }
  }
}
