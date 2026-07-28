import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class GetUnlinkedAnatomyQuizzesService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    page = parseInt(page)
    perPage = parseInt(perPage)
    const skip = (page - 1) * perPage
    const take = perPage + 1

    const linkedRecords = await prisma.feature_node_records.findMany({
      where: { record_type: 'anatomy_quiz' },
      select: { record_id: true },
    })
    const linkedIds = linkedRecords.map(r => r.record_id)

    const where = { version: 1, is_deleted: false }
    if (linkedIds.length > 0) where.id = { notIn: linkedIds }

    if (search?.trim()) {
      where.OR = [
        { title: { contains: search.trim(), mode: 'insensitive' } },
        { description: { contains: search.trim(), mode: 'insensitive' } },
      ]
    }

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where,
      take,
      skip,
      orderBy: { id: 'desc' },
    })

    const isLastPage = quizzes.length <= perPage
    const paginatedQuizzes = quizzes.slice(0, perPage)

    const attachmentMap = await attachmentService.getBulkAttachmentsWithUrls(
      paginatedQuizzes.map(quiz => ({ recordType: 'anatomy_quiz', recordId: quiz.id, name: 'image' }))
    )

    return {
      data: paginatedQuizzes,
      attachmentMap,
      pagination: { page, perPage, isLastPage },
    }
  }
}
