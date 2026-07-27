import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'diagnostic_question'

export class MoveLinkedDiagnosticQuestionService extends BaseService {
  static async call({ questionId, nodeId }) {
    const question = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const targetNode = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!targetNode) throw new ValidationError('Sub-topik tidak ditemukan')
    if (targetNode.layer !== 2) throw new ValidationError('Soal hanya dapat dipindah ke sub-topik (layer 2)')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(questionId) },
    })
    if (!existing) throw new ValidationError('Soal belum tertaut ke sub-topik manapun')
    if (existing.node_id === parseInt(nodeId)) throw new ValidationError('Soal sudah berada di sub-topik ini')

    const oldNodeId = existing.node_id

    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.update({
        where: { id: existing.id },
        data: { node_id: parseInt(nodeId) },
      })

      await tx.node_statistics.updateMany({
        where: { node_id: oldNodeId, record_type: RECORD_TYPE },
        data: { total_count: { decrement: 1 } },
      })

      await tx.node_statistics.upsert({
        where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: RECORD_TYPE } },
        create: { node_id: parseInt(nodeId), record_type: RECORD_TYPE, total_count: 1 },
        update: { total_count: { increment: 1 } },
      })
    })
  }
}
