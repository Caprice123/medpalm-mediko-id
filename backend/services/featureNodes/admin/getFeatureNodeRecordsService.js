import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class GetFeatureNodeRecordsService extends BaseService {
  static async call({ recordType, recordId } = {}) {
    if (!recordType) throw new ValidationError('recordType wajib diisi')

    const where = { record_type: recordType }
    if (recordId) where.record_id = parseInt(recordId)

    const records = await prisma.feature_node_records.findMany({
      where,
      include: { node: true },
      orderBy: { created_at: 'asc' },
    })

    return records
  }
}
