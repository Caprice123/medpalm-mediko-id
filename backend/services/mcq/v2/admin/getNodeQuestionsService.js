import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeQuestionsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'mcq_question' },
      orderBy: { id: 'asc' },
      skip,
      take,
    })

    const isLastPage = records.length <= parseInt(perPage)
    const pageRecords = records.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    if (pageRecords.length === 0) return { questions: [], pagination }

    const questionIds = pageRecords.map(r => r.record_id)
    const rawQuestions = await prisma.mcq_questions.findMany({
      where: { id: { in: questionIds } },
    })

    const qMap = new Map(rawQuestions.map(q => [q.id, q]))
    const questions = pageRecords.map(r => ({ ...qMap.get(r.record_id), nodeId: r.node_id })).filter(Boolean)

    return { questions, pagination }
  }
}
