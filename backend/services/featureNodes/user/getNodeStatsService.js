import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeStatsService extends BaseService {
  static async call({ nodeId }) {
    const rows = await prisma.node_statistics.findMany({
      where: { node_id: parseInt(nodeId), record_type: { in: ['flashcard_card', 'summary_note', 'mcq_question'] } },
      select: { record_type: true, total_count: true },
    })
    const map = Object.fromEntries(rows.map(r => [r.record_type, r.total_count]))
    return {
      flashcardCards: map['flashcard_card'] ?? 0,
      summaryNotes: map['summary_note'] ?? 0,
      mcqQuestions: map['mcq_question'] ?? 0,
    }
  }
}
