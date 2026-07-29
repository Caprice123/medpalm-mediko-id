import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import attachmentService from '#services/attachment/attachmentService'

export class AddNodeQuestionService extends BaseService {
  static async call({ nodeId, question, options, correctIndex, explanation, blobId }) {
    if (!question?.trim()) throw new ValidationError('Teks pertanyaan wajib diisi')
    if (!Array.isArray(options) || options.length < 2) throw new ValidationError('Minimal 2 pilihan jawaban')
    if (options.some(o => !o?.trim())) throw new ValidationError('Semua pilihan jawaban wajib diisi')

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Node tidak ditemukan')

    const created = await prisma.mcq_questions.create({
      data: {
        topic_id: null,
        question: question.trim(),
        options,
        correct_answer: parseInt(correctIndex) ?? 0,
        explanation: explanation?.trim() || null,
        version: 2,
      },
    })

    if (blobId) {
      await attachmentService.attach({ blobId, recordType: 'mcq_question', recordId: created.id, name: 'image' })
    }

    await prisma.feature_node_records.create({
      data: { node_id: parseInt(nodeId), record_type: 'mcq_question', record_id: created.id },
    })

    await prisma.node_statistics.upsert({
      where: { node_id_record_type: { node_id: parseInt(nodeId), record_type: 'mcq_question' } },
      create: { node_id: parseInt(nodeId), record_type: 'mcq_question', total_count: 1 },
      update: { total_count: { increment: 1 } },
    })

    return created
  }
}
