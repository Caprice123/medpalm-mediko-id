import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_case'

export class GetNodeDiagnosticCasesService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20, search }) {
    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: RECORD_TYPE },
      orderBy: { id: 'asc' },
    })

    const caseIds = records.map(r => r.record_id)
    if (caseIds.length === 0) {
      return { cases: [], pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage: true } }
    }

    const where = { id: { in: caseIds }, is_deleted: false }
    if (search) {
      where.OR = [
        { vignette: { contains: search, mode: 'insensitive' } },
        { diagnostic_questions: { some: { is_deleted: false, question: { contains: search, mode: 'insensitive' } } } },
      ]
    }

    // List view is lightweight — the vignette snippet plus the questions the row
    // previews. Full detail (image, explanations, references, linked notes) is fetched
    // separately via GetNodeDiagnosticCaseDetailService when a case is opened.
    const rawCases = await prisma.diagnostic_cases.findMany({
      where,
      select: {
        id: true,
        vignette: true,
        diagnostic_questions: {
          where: { is_deleted: false },
          orderBy: { order: 'asc' },
          select: { id: true, question: true, answer: true, answer_type: true },
        },
      },
    })

    const caseMap = new Map(rawCases.map(c => [c.id, c]))
    const orderedCases = caseIds
      .map(id => caseMap.get(id))
      .filter(Boolean)
      .map(c => ({
        id: c.id,
        vignette: c.vignette,
        questionCount: c.diagnostic_questions.length,
        questions: c.diagnostic_questions.map(q => ({
          id: q.id,
          question: q.question,
          answer: q.answer,
          answerType: q.answer_type,
        })),
      }))

    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage)
    const pageCases = orderedCases.slice(skip, skip + take + 1)
    const isLastPage = pageCases.length <= take
    const cases = pageCases.slice(0, take)

    return {
      cases,
      pagination: { page: parseInt(page), perPage: parseInt(perPage), isLastPage },
    }
  }
}
