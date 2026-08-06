import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat, decrementNodeStat } from '#utils/nodeStatisticsHelper'
import { nextAppendOrder, closeOrderGap } from '#utils/nodeRecordOrderHelper'

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

    const newOrder = await nextAppendOrder({ nodeId: parsedTargetNodeId, recordType: '3d_atlas' })
    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parsedTargetNodeId, order: newOrder },
    })
    await closeOrderGap({ nodeId: parsedNodeId, recordType: '3d_atlas', removedOrder: record.order })
    await decrementNodeStat(parsedNodeId, '3d_atlas')
    await incrementNodeStat(parsedTargetNodeId, '3d_atlas')
  }
}
