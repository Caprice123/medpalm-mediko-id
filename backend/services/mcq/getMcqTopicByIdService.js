import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { NotFoundError } from '../../errors/notFoundError.js'

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

    // Format tags
    const tags = topic.mcq_topic_tags.map(tt => ({
      id: tt.tags.id,
      name: tt.tags.name,
      tagGroupId: tt.tags.tag_group_id,
      tagGroup: {
        name: tt.tags.tag_group?.name || null
      }
    }))

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      quiz_time_limit: topic.quiz_time_limit,
      passing_score: topic.passing_score,
      status: topic.status,
      question_count: topic.mcq_questions.length,
      tags,
      mcq_questions: topic.mcq_questions
    }
  }
}
