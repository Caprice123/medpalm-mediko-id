import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeAtlasModelsService extends BaseService {
  static async call({ nodeId }) {
    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: '3d_atlas' },
      select: { record_id: true },
    })
    const ids = records.map(r => r.record_id)
    if (!ids.length) return []

    const models = await prisma.atlas_models.findMany({
      where: { id: { in: ids }, status: 'published', is_deleted: false },
      select: { unique_id: true, title: true, description: true },
      orderBy: { title: 'asc' },
    })
    return models.map(m => ({ uniqueId: m.unique_id, title: m.title, description: m.description ?? null }))
  }
}
