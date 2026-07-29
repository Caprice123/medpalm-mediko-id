import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat } from '#utils/nodeStatisticsHelper'

export class AssignAtlasToNodeService extends BaseService {
  static async call({ uniqueId, nodeId }) {
    const model = await prisma.atlas_models.findUnique({ where: { unique_id: uniqueId } })
    if (!model) throw new ValidationError('Model atlas tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: '3d_atlas', record_id: model.id },
    })
    if (existing) throw new ValidationError('Model atlas ini sudah terhubung ke modul')

    const parsedNodeId = parseInt(nodeId)
    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Modul tidak ditemukan')

    await prisma.feature_node_records.create({
      data: { node_id: parsedNodeId, record_type: '3d_atlas', record_id: model.id },
    })
    await incrementNodeStat(parsedNodeId, '3d_atlas')
  }
}
