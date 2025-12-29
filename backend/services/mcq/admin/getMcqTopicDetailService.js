import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetMcqTopicDetailService extends BaseService {
  static async call({ id }) {
    const topic = await prisma.mcq_topics.findUnique({
      where: { id },
      include: {
        mcq_questions: {
          orderBy: { order: 'asc' }
        },
        mcq_topic_tags: {
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

    if (!topic) {
      throw new ValidationError('MCQ topic not found')
    }

    return topic
  }
}
