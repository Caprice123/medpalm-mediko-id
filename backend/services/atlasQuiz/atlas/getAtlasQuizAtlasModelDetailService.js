import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { AtlasQuizAtlasModelSerializer } from '#serializers/api/v2/atlasQuizAtlasModelSerializer'

export class GetAtlasQuizAtlasModelDetailService extends BaseService {
  static async call({ slug, uniqueId }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const atlasModel = await prisma.atlas_models.findFirst({
      where: { unique_id: uniqueId, status: 'published', is_deleted: false },
    })
    if (!atlasModel) throw new ValidationError('Model tidak ditemukan')

    const mod = await this.fetchModule(atlasModel.id, topic.id)

    return {
      model: AtlasQuizAtlasModelSerializer.serialize(atlasModel),
      module: mod ? { id: mod.id, name: mod.name } : null,
      topicName: topic.name,
    }
  }

  static async fetchModule(modelId, topicId) {
    const nodeRecord = await prisma.feature_node_records.findFirst({
      where: {
        record_id: modelId,
        record_type: '3d_atlas',
        node: { parent_id: topicId, layer: 2, node_type: 'module' },
      },
      include: { node: true },
    })
    return nodeRecord?.node ?? null
  }

}
