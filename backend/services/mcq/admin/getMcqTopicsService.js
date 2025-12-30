import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetMcqTopicsService extends BaseService {
  static async call({ page = 1, limit = 30, filters = {} }) {
    this.validate(filters)

    const skip = (page - 1) * limit

    // Build where clause
    const where = {}

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.is_active !== undefined) {
      where.is_active = filters.is_active
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    // Build filter conditions for tags
    const tagFilters = []

    if (filters.university) {
      tagFilters.push({
        mcq_topic_tags: {
          some: {
            tag_id: parseInt(filters.university)
          }
        }
      })
    }

    if (filters.semester) {
      tagFilters.push({
        mcq_topic_tags: {
          some: {
            tag_id: parseInt(filters.semester)
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    // Get topics with pagination
    const [topics, total] = await Promise.all([
      prisma.mcq_topics.findMany({
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
      }),
      prisma.mcq_topics.count({ where })
    ])

    // Check if there's a next page
    const hasMore = topics.length > limit
    const topicsToReturn = hasMore ? topics.slice(0, limit) : topics

    // Format response
    const formattedTopics = topicsToReturn.map(topic => {
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
        question_count: topic.question_count || topic.mcq_questions.length,
        created_by: topic.created_by,
        created_at: topic.created_at,
        updated_at: topic.updated_at,
        tags: allTags,
        universityTags,
        semesterTags
      }
    })

    return {
      topics: formattedTopics,
      pagination: {
        page,
        limit,
        total,
        isLastPage: !hasMore
      }
    }
  }

  static validate(filters) {
    // Validate university filter if provided
    if (filters.university) {
      const universityId = parseInt(filters.university)
      if (isNaN(universityId) || universityId <= 0) {
        throw new ValidationError('Invalid university filter')
      }
    }

    // Validate semester filter if provided
    if (filters.semester) {
      const semesterId = parseInt(filters.semester)
      if (isNaN(semesterId) || semesterId <= 0) {
        throw new ValidationError('Invalid semester filter')
      }
    }
  }
}
