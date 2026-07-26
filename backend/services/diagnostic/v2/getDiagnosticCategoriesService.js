import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VISIBILITY = 'diagnostic'
const RECORD_TYPE = 'diagnostic_question'

export class GetDiagnosticCategoriesService extends BaseService {
  static async call({ classification } = {}) {
    const topicWhere = { layer: 1, visibility: VISIBILITY }
    if (classification) topicWhere.classification = classification

    const topics = await prisma.feature_nodes.findMany({
      where: topicWhere,
      orderBy: { name: 'asc' },
    })

    if (topics.length === 0) return []

    const topicIds = topics.map(t => t.id)

    const subtopics = await prisma.feature_nodes.findMany({
      where: { parent_id: { in: topicIds }, layer: 2, visibility: VISIBILITY },
      select: {
        id: true,
        parent_id: true,
        node_statistics: {
          where: { record_type: RECORD_TYPE },
          select: { total_count: true },
        },
      },
    })

    const subtopicCountByTopic = new Map()
    const questionCountByTopic = new Map()
    for (const s of subtopics) {
      const pid = s.parent_id
      subtopicCountByTopic.set(pid, (subtopicCountByTopic.get(pid) ?? 0) + 1)
      questionCountByTopic.set(pid, (questionCountByTopic.get(pid) ?? 0) + (s.node_statistics[0]?.total_count ?? 0))
    }

    return topics.map(t => ({
      ...t,
      subtopicCount: subtopicCountByTopic.get(t.id) ?? 0,
      questionCount: questionCountByTopic.get(t.id) ?? 0,
    }))
  }
}
