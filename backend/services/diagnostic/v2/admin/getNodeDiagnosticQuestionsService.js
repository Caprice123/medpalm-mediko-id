import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'

export class GetNodeDiagnosticQuestionsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20, search }) {
    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: RECORD_TYPE },
      orderBy: { id: 'asc' },
    })

    const questionIds = records.map(r => r.record_id)
    if (questionIds.length === 0) {
      return { questions: [], pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage: true } }
    }

    const where = { id: { in: questionIds } }
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { vignette: { contains: search, mode: 'insensitive' } },
      ]
    }

    const rawQuestions = await prisma.diagnostic_questions.findMany({ where })
    const qMap = new Map(rawQuestions.map(q => [q.id, q]))
    const orderedQuestions = questionIds.map(id => qMap.get(id)).filter(Boolean)

    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage)
    const pageQuestions = orderedQuestions.slice(skip, skip + take + 1)
    const isLastPage = pageQuestions.length <= take
    const questions = pageQuestions.slice(0, take)

    return {
      questions,
      pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage },
    }
  }
}
