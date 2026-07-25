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
    const subtopicIdsByTopic = new Map()
    for (const s of subtopics) {
      const count = s.node_statistics[0]?.total_count ?? 0
      questionsByTopic.set(s.parent_id, (questionsByTopic.get(s.parent_id) ?? 0) + count)
      if (!subtopicIdsByTopic.has(s.parent_id)) subtopicIdsByTopic.set(s.parent_id, [])
      subtopicIdsByTopic.get(s.parent_id).push(s.id)
    }

    const allSubtopicIds = subtopics.map(s => s.id)
    const progressRecords = userId ? await prisma.user_node_progress.findMany({
      where: { user_id: userId, node_id: { in: allSubtopicIds }, feature_type: 'mcq' },
    }) : []

    const progressByNode = new Map(progressRecords.map(p => [p.node_id, p]))

    return topics.map(t => {
      const subtopicIds = subtopicIdsByTopic.get(t.id) || []
      let totalSessions = 0, totalScore = 0, sessionCount = 0
      for (const sid of subtopicIds) {
        const p = progressByNode.get(sid)
        if (p) {
          totalSessions += p.total_sessions
          totalScore += p.total_score
          sessionCount += p.total_sessions
        }
      }
      const avgScore = sessionCount > 0 ? Math.round(totalScore / sessionCount) : null
      return {
        id: t.id,
        name: t.name,
        questionCount: questionsByTopic.get(t.id) ?? 0,
        totalSessions,
        avgScore,
      }
    })
  }
}
