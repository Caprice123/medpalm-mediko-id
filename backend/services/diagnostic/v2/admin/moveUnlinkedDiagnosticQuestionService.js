import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const RECORD_TYPE = 'diagnostic_question'

export class MoveUnlinkedDiagnosticQuestionService extends BaseService {
  static async call({ questionId, nodeId }) {
    const question = await prisma.diagnostic_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: RECORD_TYPE, record_id: parseInt(questionId) },
    })
    if (existing) throw new ValidationError('Soal sudah tertaut ke sub-topik lain')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')
    if (node.layer !== 2) throw new ValidationError('Soal hanya dapat dipindah ke sub-topik (layer 2)')

    await prisma.$transaction(async (tx) => {
      await tx.feature_node_records.create({
        data: {
          node_id: parseInt(nodeId),
          record_type: RECORD_TYPE,
          record_id: parseInt(questionId),
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
