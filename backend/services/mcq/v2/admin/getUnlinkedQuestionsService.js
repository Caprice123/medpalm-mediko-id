import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedQuestionsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND mq.question ILIKE ${`%${search.trim()}%`}`
      : Prisma.empty

    const rawQuestions = await prisma.$queryRaw`
      SELECT mq.id, mq.topic_id, mq.question, mq.options, mq.correct_answer, mq.explanation, mq.order, mq.created_at, mq.updated_at
      FROM mcq_questions mq
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'mcq_question' AND fnr.record_id = mq.id
      WHERE fnr.id IS NULL
        ${searchFilter}
      ORDER BY mq.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawQuestions.length <= parseInt(perPage)
    const questions = rawQuestions.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    return { questions, pagination }
  }
}
