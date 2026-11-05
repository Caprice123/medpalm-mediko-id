import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'diagnostic_case'

export class MoveUnlinkedDiagnosticCaseService extends BaseService {
  static async call({ caseId, nodeId }) {
    const diagnosticCase = await prisma.diagnostic_cases.findUnique({ where: { id: parseInt(caseId) } })
    if (!diagnosticCase || diagnosticCase.is_deleted) throw new ValidationError('Kasus tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(caseId) },
    })
    if (existing) throw new ValidationError('Kasus sudah tertaut ke sub-topik lain')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')
    if (node.layer !== 2) throw new ValidationError('Kasus hanya dapat dipindah ke sub-topik (layer 2)')

    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.create({
        data: {
          node_id: parseInt(nodeId),
          record_type: RECORD_TYPE,
          record_id: parseInt(caseId),
        },
      })

      await tx.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: RECORD_TYPE } },
        create: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, total_count: 1 },
        update: { total_count: { increment: 1 } },
      })
    })
  }
}
