import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat, decrementNodeStat } from '#utils/nodeStatisticsHelper'

export class MoveNodeAtlasModelService extends BaseService {
  static async call({ nodeId, modelId, targetNodeId }) {
    const parsedNodeId = parseInt(nodeId)
    const parsedTargetNodeId = parseInt(targetNodeId)

    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parsedNodeId, record_type: '3d_atlas', record_id: parseInt(modelId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parsedTargetNodeId } })
    if (!targetNode) throw new ValidationError('Modul tujuan tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { node_id: parsedTargetNodeId, record_type: '3d_atlas', record_id: parseInt(modelId) },
    })
    if (existing) throw new ValidationError('Konten sudah ada di modul tujuan')

    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parsedTargetNodeId },
    })
    await decrementNodeStat(parsedNodeId, '3d_atlas')
    await incrementNodeStat(parsedTargetNodeId, '3d_atlas')
  }
}
