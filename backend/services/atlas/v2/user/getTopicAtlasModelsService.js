import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetTopicAtlasModelsService extends BaseService {
  static async call({ topicId }) {
    const modules = await prisma.feature_nodes.findMany({
      where: { parent_id: parseInt(topicId), layer: 2, node_type: 'module' },
      select: { id: true, name: true, classification: true },
      orderBy: { name: 'asc' },
    })
    if (!modules.length) return []

    const moduleIds = modules.map(m => m.id)
    const records = await prisma.feature_node_records.findMany({
      where: { node_id: { in: moduleIds }, record_type: '3d_atlas' },
      select: { node_id: true, record_id: true },
    })
    if (!records.length) return []

    const atlasModels = await prisma.atlas_models.findMany({
      where: { id: { in: [...new Set(records.map(r => r.record_id))] }, status: 'published', is_deleted: false },
      select: { id: true, unique_id: true, title: true, description: true },
      orderBy: { title: 'asc' },
    })
    const atlasById = Object.fromEntries(atlasModels.map(m => [m.id, m]))

    return modules
      .map(mod => ({
        moduleId: mod.id,
        moduleName: mod.name,
        classification: mod.classification,
        models: records
          .filter(r => r.node_id === mod.id)
          .map(r => atlasById[r.record_id])
          .filter(Boolean)
          .map(m => ({ uniqueId: m.unique_id, title: m.title, description: m.description ?? null })),
      }))
      .filter(g => g.models.length > 0)
  }
}
