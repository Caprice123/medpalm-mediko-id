import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetAtlasModelsService extends BaseService {
  static async call(filters = {}) {
    const page = Math.max(1, parseInt(filters.page) || 1)
    const perPage = Math.min(100, Math.max(1, parseInt(filters.perPage) || 20))
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const where = { status: 'published' }
    const tagFilters = []

    if (filters.topic) {
      const topicIds = Array.isArray(filters.topic)
        ? filters.topic.map(id => parseInt(id))
        : filters.topic.split(',').map(id => parseInt(id))

      tagFilters.push({
        atlas_model_tags: { some: { tag_id: { in: topicIds } } }
      })
    }

    if (filters.subtopic) {
      const subtopicIds = Array.isArray(filters.subtopic)
        ? filters.subtopic.map(id => parseInt(id))
        : filters.subtopic.split(',').map(id => parseInt(id))

      tagFilters.push({
        atlas_model_tags: { some: { tag_id: { in: subtopicIds } } }
      })
    }

    if (tagFilters.length > 0) {
      where.AND = tagFilters
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
            tags: { include: { tag_group: true } }
          }
        }
      },
      orderBy: { created_at: 'desc' }
    })

    const isLastPage = models.length <= perPage
    const paginatedModels = models.slice(0, perPage)

    return {
      models: paginatedModels,
      pagination: { page, perPage, isLastPage }
    }
  }
}
