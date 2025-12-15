import { ValidationError } from '../../../errors/validationError.js'
import prisma from '../../../prisma/client.js'
import { BaseService } from '../../baseService.js'

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

    // Separate tags by group
    const allTags = topic.mcq_topic_tags.map(tt => ({
      id: tt.tags.id,
      name: tt.tags.name,
      tagGroupName: tt.tags.tag_group?.name || null
    }))

    const universityTags = allTags.filter(tag => tag.tagGroupName === 'university')
    const semesterTags = allTags.filter(tag => tag.tagGroupName === 'semester')

    return {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      content_type: topic.content_type,
      source_url: topic.source_url,
      source_key: topic.source_key,
      source_filename: topic.source_filename,
      quiz_time_limit: topic.quiz_time_limit,
      passing_score: topic.passing_score,
      status: topic.status,
      is_active: topic.is_active,
      created_by: topic.created_by,
      created_at: topic.created_at,
      updated_at: topic.updated_at,
      questions: topic.mcq_questions,
      tags: allTags,
      universityTags,
      semesterTags
    }
  }
}
