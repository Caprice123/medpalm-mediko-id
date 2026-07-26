import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'diagnostic_question'

export class DeleteDiagnosticNodeService extends BaseService {
  static async call({ id }) {
    const node = await prisma.feature_nodes.findUnique({
      where: { id: parseInt(id) },
      include: { _count: { select: { children: true } } },
    })
    if (!node) throw new ValidationError('Node tidak ditemukan')
    if (node._count.children > 0) throw new ValidationError('Hapus semua sub-node terlebih dahulu')

    const recordCount = await prisma.feature_node_records.count({
      where: { node_id: parseInt(id), record_type: RECORD_TYPE },
    })
    if (recordCount > 0) throw new ValidationError('Hapus semua pertanyaan dalam node ini terlebih dahulu')

    await prisma.node_statistics.deleteMany({ where: { node_id: parseInt(id), record_type: RECORD_TYPE } })
    await prisma.feature_nodes.delete({ where: { id: parseInt(id) } })
  }
}
