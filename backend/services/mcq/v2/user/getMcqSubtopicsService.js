import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetMcqSubtopicsService extends BaseService {
  static async call({ userId, topicId }) {
    const subtopics = await prisma.feature_nodes.findMany({
      where: { parent_id: parseInt(topicId), layer: 2, visibility: 'general', node_type: 'subtopic' },
      orderBy: { name: 'asc' },
      include: {
        node_statistics: {
          where: { record_type: 'mcq_question' },
          select: { total_count: true },
        },
      },
    })

    const subtopicIds = subtopics.map(s => s.id)
    const progressRecords = userId && subtopicIds.length > 0
      ? await prisma.user_node_progress.findMany({
          where: { user_id: userId, node_id: { in: subtopicIds }, feature_type: 'mcq' },
        })
      : []

    const progressMap = new Map(progressRecords.map(p => [p.node_id, p]))

    return subtopics.map(s => {
      const prog = progressMap.get(s.id)
      const avgScore = prog && prog.total_questions > 0
        ? Math.round((prog.total_correct / prog.total_questions) * 100)
        : null
      return {
        id: s.id,
        name: s.name,
        questionCount: s.node_statistics[0]?.total_count ?? 0,
        totalSessions: prog?.total_sessions ?? 0,
        avgScore,
      }
    }).sort((a, b) => {
      if (a.avgScore == null && b.avgScore == null) return 0
      if (a.avgScore == null) return 1
      if (b.avgScore == null) return -1
      return b.avgScore - a.avgScore
    })
  }
}
