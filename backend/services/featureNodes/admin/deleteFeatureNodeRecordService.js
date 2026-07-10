import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteFeatureNodeRecordService extends BaseService {
  static async call({ id }) {
    const record = await prisma.feature_node_records.findUnique({ where: { id: parseInt(id) } })
    if (!record) throw new ValidationError('Relasi tidak ditemukan')

    await prisma.feature_node_records.delete({ where: { id: parseInt(id) } })
  }
}
