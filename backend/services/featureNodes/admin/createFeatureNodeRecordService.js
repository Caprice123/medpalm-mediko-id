import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateFeatureNodeRecordService extends BaseService {
  static async call({ nodeId, recordType, recordId }) {
    if (!nodeId) throw new ValidationError('nodeId wajib diisi')
    if (!recordType) throw new ValidationError('recordType wajib diisi')
    if (!recordId) throw new ValidationError('recordId wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const existing = await prisma.feature_node_records.findUnique({
      where: { node_id_record_type_record_id: { node_id: parseInt(nodeId), record_type: recordType, record_id: parseInt(recordId) } },
    })
    if (existing) throw new ValidationError('Relasi ini sudah ada')

    const record = await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: recordType, record_id: parseInt(recordId) },
      include: { node: true },
    })

    return record
  }
}
