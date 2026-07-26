import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedDiagnosticQuestionsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND (dq.question ILIKE ${`%${search.trim()}%`} OR dq.vignette ILIKE ${`%${search.trim()}%`})`
      : Prisma.empty

    const rawQuestions = await prisma.$queryRaw`
      SELECT dq.id, dq.quiz_id, dq.question, dq.vignette, dq.answer, dq.answer_type, dq.choices, dq.explanation, dq.image_caption, dq.order, dq.created_at, dq.updated_at
      FROM diagnostic_questions dq
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'diagnostic_question' AND fnr.record_id = dq.id
      WHERE fnr.id IS NULL
        ${searchFilter}
      ORDER BY dq.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawQuestions.length <= parseInt(perPage)
    const questions = rawQuestions.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    return { questions, pagination }
  }
}
