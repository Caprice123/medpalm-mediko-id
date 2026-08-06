import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeAtlasModelsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    page = parseInt(page)
    perPage = parseInt(perPage)

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: '3d_atlas' },
      orderBy: [{ order: { sort: 'asc', nulls: 'last' } }, { created_at: 'asc' }],
      select: { record_id: true },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = records.length <= perPage
    const pageRecords = isLastPage ? records : records.slice(0, perPage)
    const modelIds = pageRecords.map(r => r.record_id)

    if (!modelIds.length) {
      return { data: [], pagination: { page, perPage, isLastPage: true } }
    }

    const models = await prisma.atlas_models.findMany({
      where: { id: { in: modelIds } },
    })

    // findMany({ id: { in } }) does not preserve input order — resort to match
    // the feature_node_records order the pagination above was actually built on.
    const modelsById = new Map(models.map(m => [m.id, m]))
    const orderedModels = modelIds.map(id => modelsById.get(id)).filter(Boolean)

    return {
      data: orderedModels,
      pagination: { page, perPage, isLastPage },
    }
  }
}
