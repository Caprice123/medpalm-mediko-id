import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'

export class GetNodeDiagnosticQuestionsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: RECORD_TYPE },
      orderBy: { id: 'asc' },
      skip,
      take,
    })

    const isLastPage = records.length <= parseInt(perPage)
    const pageRecords = records.slice(0, parseInt(perPage))

    if (pageRecords.length === 0) {
      return { questions: [], pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage: true } }
    }

    const questionIds = pageRecords.map(r => r.record_id)
    const rawQuestions = await prisma.diagnostic_questions.findMany({ where: { id: { in: questionIds } } })
    const qMap = new Map(rawQuestions.map(q => [q.id, q]))
    const questions = pageRecords.map(r => qMap.get(r.record_id)).filter(Boolean)

    return {
      questions,
      pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage },
    }
  }
}
