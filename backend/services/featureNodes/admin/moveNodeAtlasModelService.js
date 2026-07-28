import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class MoveNodeAtlasModelService extends BaseService {
  static async call({ nodeId, modelId, targetNodeId }) {
    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(nodeId), record_type: '3d_atlas', record_id: parseInt(modelId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(targetNodeId) } })
    if (!targetNode) throw new ValidationError('Modul tujuan tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(targetNodeId), record_type: '3d_atlas', record_id: parseInt(modelId) },
    })
    if (existing) throw new ValidationError('Konten sudah ada di modul tujuan')

    await prisma.feature_node_records.update({
      where: { id: record.id },
      data: { node_id: parseInt(targetNodeId) },
    })
  }
}
