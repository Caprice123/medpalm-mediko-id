import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeAtlasModelsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    page = parseInt(page)
    perPage = parseInt(perPage)

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: '3d_atlas' },
      select: { record_id: true },
    })

    const modelIds = records.map(r => r.record_id)

    if (!modelIds.length) {
      return { data: [], pagination: { page, perPage, isLastPage: true } }
    }

    const models = await prisma.atlas_models.findMany({
      where: { id: { in: modelIds } },
      include: {
        atlas_model_tags: { include: { tags: { include: { tag_group: true } } } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = models.length <= perPage
    return {
      data: isLastPage ? models : models.slice(0, perPage),
      pagination: { page, perPage, isLastPage },
    }
  }
}
