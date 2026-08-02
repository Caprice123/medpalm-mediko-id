import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const ALLOWED = ['flashcard_card', 'mcq_question', 'summary_note']

export class GetNodePreviewService extends BaseService {
  static async call({ nodeId, type }) {
    if (!ALLOWED.includes(type)) throw new ValidationError('Tipe tidak valid')

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: type },
      select: { record_id: true },
    })
    const ids = records.map(r => r.record_id)
    if (!ids.length) return []

    if (type === 'flashcard_card') {
      const rows = await prisma.flashcard_cards.findMany({
        where: { id: { in: ids }, is_deleted: false },
        select: { id: true, front: true, back: true },
        orderBy: { order: 'asc' },
      })
      return rows.map(r => ({ id: r.id, front: r.front, back: r.back }))
    }

    if (type === 'mcq_question') {
      const rows = await prisma.mcq_questions.findMany({
        where: { id: { in: ids } },
        select: { id: true, question: true, options: true, correct_answer: true, explanation: true },
        orderBy: { order: 'asc' },
      })
      return rows.map(r => ({ id: r.id, question: r.question, options: r.options, correctAnswer: r.correct_answer, explanation: r.explanation ?? null }))
    }

    const rows = await prisma.summary_notes.findMany({
      where: { id: { in: ids }, is_deleted: false },
      select: { id: true, unique_id: true, title: true, description: true, content: true },
    })
    return rows.map(r => ({
      id: r.id,
      uniqueId: r.unique_id,
      title: r.title,
      description: r.description ?? null,
      readingMinutes: Math.max(1, Math.ceil((r.content?.length ?? 0) / 1500)),
    }))
  }
}
