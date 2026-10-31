import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeAnatomyQuizzesService extends BaseService {
  static async call({ nodeId }) {
    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'anatomy_quiz' },
      select: { record_id: true },
    })
    const ids = records.map(r => r.record_id)
    if (!ids.length) return []

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where: { id: { in: ids }, status: 'published', is_deleted: false },
      select: { unique_id: true, title: true, description: true },
      orderBy: { title: 'asc' },
    })
    return quizzes.map(q => ({ uniqueId: q.unique_id, title: q.title, description: q.description ?? null }))
  }
}
