import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { AtlasQuizTopicSerializer } from '#serializers/api/v2/atlasQuizTopicSerializer'

export class GetAtlasQuizTopicsService extends BaseService {
  static async call({ classification, page = 1, perPage = 9 } = {}) {
    const where = { layer: 1, visibility: 'general', parent_id: null }
    if (classification) where.classification = classification

    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(50, Math.max(1, parseInt(perPage) || 9))
    const skip = (currentPage - 1) * currentPerPage

    const topics = await this.fetchTopics({ where, skip, currentPerPage })
    const isLastPage = topics.length <= currentPerPage
    const sliced = topics.slice(0, currentPerPage)

    if (sliced.length === 0) {
      return {
        topics: [],
        pagination: { page: currentPage, perPage: currentPerPage, isLastPage: true },
      }
    }

    const topicIds = sliced.map(t => t.id)
    const { atlasCountMap, quizCountMap } = await this.fetchModuleStatsByTopicIds(topicIds)

    return {
      topics: sliced.map(t => AtlasQuizTopicSerializer.serialize(t, atlasCountMap, quizCountMap)),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }

  static async fetchTopics({ where, skip, currentPerPage }) {
    return prisma.feature_nodes.findMany({
      where,
      orderBy: { name: 'asc' },
      skip,
      take: currentPerPage + 1,
    })
  }

  static async fetchModuleStatsByTopicIds(topicIds) {
    const moduleNodes = await prisma.feature_nodes.findMany({
      where: { parent_id: { in: topicIds }, layer: 2 },
      select: { id: true, parent_id: true },
    })

    const moduleIds = moduleNodes.map(m => m.id)
    const moduleToTopic = Object.fromEntries(moduleNodes.map(m => [m.id, m.parent_id]))

    const stats = moduleIds.length > 0
      ? await prisma.node_statistics.findMany({
          where: { node_id: { in: moduleIds }, record_type: { in: ['3d_atlas', 'anatomy_quiz'] } },
        })
      : []

    const atlasCountMap = {}
    const quizCountMap = {}
    stats.forEach(s => {
      const topicId = moduleToTopic[s.node_id]
      if (s.record_type === '3d_atlas') atlasCountMap[topicId] = (atlasCountMap[topicId] || 0) + s.total_count
      if (s.record_type === 'anatomy_quiz') quizCountMap[topicId] = (quizCountMap[topicId] || 0) + s.total_count
    })

    return { atlasCountMap, quizCountMap }
  }

}
