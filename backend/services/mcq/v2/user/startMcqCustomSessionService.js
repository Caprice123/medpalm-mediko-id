import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { buildQuestionsResponse } from './startMcqNodeSessionService.js'

export class StartMcqCustomSessionService extends BaseService {
  static async call({ userId, nodeIds, count }) {
    const intIds = nodeIds.map(id => parseInt(id))

    const refs = await prisma.feature_node_records.findMany({
      where: { node_id: { in: intIds }, record_type: 'mcq_question' },
      select: { record_id: true, node_id: true },
    })
    if (refs.length === 0) return []

    const questionToNode = new Map(refs.map(r => [r.record_id, r.node_id]))
    const allIds = [...new Set(refs.map(r => r.record_id))]
    const limit = parseInt(count) || allIds.length
    const selected = allIds.sort(() => Math.random() - 0.5).slice(0, limit)

    const selectedToNode = new Map(selected.map(id => [id, questionToNode.get(id)]))
    return buildQuestionsResponse(selected, selectedToNode, userId)
  }
}
