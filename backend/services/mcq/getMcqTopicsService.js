import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'

export class GetMcqTopicsService extends BaseService {
  static async call({ page = 1, limit = 30, filters = {} }) {
    const skip = (page - 1) * limit

    // Build where clause - only show published and active topics
    const where = {
      is_active: true,
      status: 'published'
    }

    // Tag filtering
    if (filters.universityTagIds && filters.universityTagIds.length > 0) {
      where.mcq_topic_tags = {
        some: {
          tag_id: {
            in: filters.universityTagIds.map(Number)
          }
        }
      }
    }

    if (filters.semesterTagIds && filters.semesterTagIds.length > 0) {
      if (!where.mcq_topic_tags) {
        where.mcq_topic_tags = { some: {} }
      }

      // If we already have university filter, we need to combine them
      if (filters.universityTagIds && filters.universityTagIds.length > 0) {
        where.AND = [
          {
            mcq_topic_tags: {
              some: {
                tag_id: { in: filters.universityTagIds.map(Number) }
              }
            }
          },
          {
            mcq_topic_tags: {
              some: {
                tag_id: { in: filters.semesterTagIds.map(Number) }
              }
            }
          }
        ]
        delete where.mcq_topic_tags
      } else {
        where.mcq_topic_tags.some.tag_id = {
          in: filters.semesterTagIds.map(Number)
        }
      }
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    // Get topics with pagination
    const topics = await prisma.mcq_topics.findMany({
      where,
      skip,
      take: limit + 1, // Get one extra to check if there's a next page
      orderBy: { created_at: 'desc' },
      include: {
        mcq_questions: {
          select: {
            id: true
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

    // Check if there's a next page
    const hasMore = topics.length > limit
    const topicsToReturn = hasMore ? topics.slice(0, limit) : topics

    // Format response
    const formattedTopics = topicsToReturn.map(topic => {
      const topicTags = topic.mcq_topic_tags.map(tt => ({
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
        updated_at: topic.updated_at,
        tags: topicTags
      }
    })

    return {
      topics: formattedTopics,
      pagination: {
        page,
        limit,
        isLastPage: !hasMore
      }
    }
  }
}
