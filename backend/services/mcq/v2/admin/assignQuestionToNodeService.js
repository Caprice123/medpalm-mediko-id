import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class AssignQuestionToNodeService extends BaseService {
  static async call({ questionId, nodeId }) {
    const question = await prisma.mcq_questions.findUnique({ where: { id: parseInt(questionId) } })
    if (!question) throw new ValidationError('Pertanyaan tidak ditemukan')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    const existing = await prisma.feature_node_records.findFirst({
      where: { record_type: 'mcq_question', record_id: parseInt(questionId) },
    })
    if (existing) throw new ValidationError('Pertanyaan ini sudah terhubung ke sub-topik')

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: parseInt(questionId) },
    })

    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'mcq_question' } },
      create: { node_id: parseInt(nodeId), record_type: 'mcq_question', total_count: 1 },
      update: { total_count: { increment: 1 } },
    })
  }
}
