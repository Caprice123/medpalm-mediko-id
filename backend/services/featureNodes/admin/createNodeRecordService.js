import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { incrementNodeStat } from '#utils/nodeStatisticsHelper'

const SUPPORTED_RECORD_TYPES = ['summary_note']

export class CreateNodeRecordService extends BaseService {
  static async call({ nodeId, recordType, recordId }) {
    if (!nodeId) throw new ValidationError('Node ID wajib diisi')
    if (!recordId) throw new ValidationError('Record ID wajib diisi')
    if (!SUPPORTED_RECORD_TYPES.includes(recordType)) throw new ValidationError('Tipe record tidak didukung')

    const parsedNodeId = parseInt(nodeId)
    const parsedRecordId = parseInt(recordId)

    const node = await prisma.feature_nodes.findUnique({ where: { id: parsedNodeId } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    if (recordType === 'summary_note') {
      const note = await prisma.summary_notes.findUnique({ where: { id: parsedRecordId } })
      if (!note) throw new ValidationError('Ringkasan tidak ditemukan')

      const existingOnNode = await prisma.feature_node_records.findFirst({
        where: { node_id: parsedNodeId, record_type: 'summary_note' },
      })
      if (existingOnNode) throw new ValidationError('Sub-topik ini sudah memiliki ringkasan')
    }

    const existingForRecord = await prisma.feature_node_records.findFirst({
      where: { record_type: recordType, record_id: parsedRecordId },
    })
    if (existingForRecord) throw new ValidationError('Konten ini sudah terhubung ke sub-topik lain')

    const record = await prisma.feature_node_records.create({
      data: { node_id: parsedNodeId, record_type: recordType, record_id: parsedRecordId },
    })
    await incrementNodeStat(parsedNodeId, recordType)

    return record
  }
}
