import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetPublishedOsceTopicsService extends BaseService {
  static async call(filters = {}) {
    // Pagination
    const page = parseInt(filters.page) || 1
    const perPage = parseInt(filters.perPage) || 20
    const skip = (page - 1) * perPage

    const where = {
      status: 'published'
    }

    // Search filter
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { scenario: { contains: filters.search, mode: 'insensitive' } },
      ]
    }

    // Tag filters
    const tagFilters = []

    if (filters.topicTag) {
      tagFilters.push({
        osce_topic_tags: {
          some: {
            tag_id: parseInt(filters.topicTag)
          }
        }
      })
    }

    if (filters.batchTag) {
      tagFilters.push({
        osce_topic_tags: {
          some: {
            tag_id: parseInt(filters.batchTag)
          }
        }
      })
    }

    // Apply tag filters with AND logic
    if (tagFilters.length > 0) {
      if (where.AND) {
        where.AND = [...where.AND, ...tagFilters]
      } else {
        where.AND = tagFilters
      }
    }

    const topics = await prisma.osce_topics.findMany({
      skip,
      take: perPage,
      where,
      select: {
        id: true,
        title: true,
        unique_id: true,
        description: true,
        scenario: true,
        ai_model: true,
        duration_minutes: true,
        created_at: true,
        updated_at: true,
        osce_topic_tags: {
          select: {
            tags: {
              select: {
                id: true,
                name: true,
                tag_group: {
                  select: {
                    id: true,
                    name: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    })

    return {
      topics,
      pagination: {
        page,
        perPage,
        isLastPage: topics.length < perPage
      }
    }
  }
}
