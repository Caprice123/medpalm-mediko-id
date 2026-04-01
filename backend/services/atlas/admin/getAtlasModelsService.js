import { ValidationError } from '#errors/validationError'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetAtlasModelsService extends BaseService {
  static async call(filters = {}) {
    this.validate(filters)

    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(filters.perPage) || 20))
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = {}
    const tagFilters = []

    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic.map(id => parseInt(id))
        : filters.topic.split(',').map(id => parseInt(id))

      tagFilters.push({
        atlas_model_tags: {
          some: { tag_id: { in: topicIds } }
        }
      })
    }

    if (filters.subtopic) {
      const subtopicIds = Array.isArray(filters.subtopic)
        ? filters.subtopic.map(id => parseInt(id))
        : filters.subtopic.split(',').map(id => parseInt(id))

      tagFilters.push({
        atlas_model_tags: {
          some: { tag_id: { in: subtopicIds } }
        }
      })
    }

    if (tagFilters.length > 0) {
      where.AND = tagFilters
    }

    if (filters.status) {
      where.status = filters.status
    }

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } }
      ]
    }

    const models = await prisma.atlas_models.findMany({
      where,
      take,
      skip,
      include: {
        atlas_model_tags: {
          include: {
            tags: {
              include: { tag_group: true }
            }
          }
        },
        _count: {
          select: { atlas_structures: true }
        }
      },
      orderBy: { id: 'desc' }
    })

    const isLastPage = models.length <= perPage
    const paginatedModels = models.slice(0, perPage)

    return {
      data: paginatedModels,
      pagination: { page, perPage, isLastPage }
    }
  }

  static validate(filters) {
    if (filters.topic) {
      const ids = Array.isArray(filters.topic)
        ? filters.topic
        : filters.topic.split(',')

      for (const id of ids) {
        if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
          throw new ValidationError('Invalid topic filter')
        }
      }
    }

    if (filters.subtopic) {
      const ids = Array.isArray(filters.subtopic)
        ? filters.subtopic
        : filters.subtopic.split(',')

      for (const id of ids) {
        if (isNaN(parseInt(id)) || parseInt(id) <= 0) {
          throw new ValidationError('Invalid subtopic filter')
        }
      }
    }

    if (filters.status && !['draft', 'published'].includes(filters.status)) {
      throw new ValidationError('Invalid status filter. Must be "draft" or "published"')
    }

    if (filters.page && (isNaN(parseInt(filters.page)) || parseInt(filters.page) < 1)) {
      throw new ValidationError('Invalid page number')
    }

    if (filters.perPage) {
      const perPage = parseInt(filters.perPage)
      if (isNaN(perPage) || perPage < 1 || perPage > 100) {
        throw new ValidationError('Invalid perPage. Must be between 1 and 100')
      }
    }
  }
}
