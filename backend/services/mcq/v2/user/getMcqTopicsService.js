import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetMcqTopicsService extends BaseService {
  static async call({ userId }) {
    const topics = await prisma.feature_nodes.findMany({
      where: { layer: 1 },
      orderBy: { name: 'asc' },
    })
    if (topics.length === 0) return []

    const topicIds = topics.map(t => t.id)

    const subtopics = await prisma.feature_nodes.findMany({
      where: { parent_id: { in: topicIds }, layer: 2 },
      select: {
        id: true,
        parent_id: true,
        node_statistics: {
          where: { record_type: 'mcq_question' },
          select: { total_count: true },
        },
      },
    })

    const questionsByTopic = new Map()
    for (const s of subtopics) {
      const count = s.node_statistics[0]?.total_count ?? 0
      questionsByTopic.set(s.parent_id, (questionsByTopic.get(s.parent_id) ?? 0) + count)
    }

    const progressRecords = userId ? await prisma.user_node_progress.findMany({
      where: { user_id: userId, node_id: { in: topicIds }, feature_type: 'mcq' },
    }) : []

    const progressByTopic = new Map(progressRecords.map(p => [p.node_id, p]))

    return topics.map(t => {
      const prog = progressByTopic.get(t.id)
      const avgScore = prog && prog.total_questions > 0
        ? Math.round((prog.total_correct / prog.total_questions) * 100)
        : null
      return {
        id: t.id,
        name: t.name,
        questionCount: questionsByTopic.get(t.id) ?? 0,
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
