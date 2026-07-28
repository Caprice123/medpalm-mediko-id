import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UnlinkNodeAtlasModelService extends BaseService {
  static async call({ nodeId, modelId }) {
    const record = await prisma.feature_node_records.findFirst({
      where: { node_id: parseInt(nodeId), record_type: '3d_atlas', record_id: parseInt(modelId) },
    })
    if (!record) throw new ValidationError('Konten tidak ditemukan di modul ini')
    await prisma.feature_node_records.delete({ where: { id: record.id } })
  }
}
