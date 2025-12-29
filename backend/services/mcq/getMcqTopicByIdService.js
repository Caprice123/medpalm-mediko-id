import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'

export class GetMcqTopicByIdService extends BaseService {
  static async call({ topicId }) {
    const topic = await prisma.mcq_topics.findFirst({
      where: {
        id: topicId,
        is_active: true,
        status: 'published'
      },
      include: {
        mcq_questions: {
          orderBy: {
            order: 'asc'
          }
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
      throw new NotFoundError('MCQ topic not found or not published')
    }

    // NOTE: Returns raw Prisma data - serializers handle transformation
    // SECURITY: This service returns full question data including correct_answer
    // Should ONLY be used with serializers that control what gets exposed
    return topic
  }
}
