import { NotFoundError } from '#errors/notFoundError'
import { AuthorizationError } from '#errors/authorizationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { checkAccessAndDeductCredit } from '#services/shared/checkAccessAndDeductCreditService'

export class GetUserCalculatorTopicDetailService extends BaseService {
  static async call(topicId, { userId, userRole = 'user' } = {}) {
    const topic = await prisma.$transaction(async (tx) => {
      const topic = await tx.calculator_topics.findUnique({
        where: { unique_id: topicId },
        include: {
          calculator_fields: {
            orderBy: { order: 'asc' },
            include: {
              field_options: { orderBy: { order: 'asc' } }
            }
          },
          calculator_results: { orderBy: { id: 'asc' } },
          calculator_classifications: {
            orderBy: { order: 'asc' },
            include: {
              options: {
                orderBy: { order: 'asc' },
                include: { conditions: { orderBy: { order: 'asc' } } }
              }
            }
          },
          calculator_topic_tags: {
            include: { tags: true }
          }
        }
      })

      if (!topic || topic.is_deleted) {
        throw new NotFoundError('Calculator topic not found')
      }

      if (userRole === 'user' && topic.status !== 'published') {
        throw new AuthorizationError('This calculator topic is not available')
      }

      await checkAccessAndDeductCredit(tx, {
        userId,
        userRole,
        accessTypeKey: 'calculator_access_type',
        creditCostKey: 'calculator_topic_cost',
        description: `Viewed calculator topic: ${topic.id} - ${topic.title}`
      })

      return topic
    })

    return topic
  }
}
