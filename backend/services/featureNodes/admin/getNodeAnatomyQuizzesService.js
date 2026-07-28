import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class GetNodeAnatomyQuizzesService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    page = parseInt(page)
    perPage = parseInt(perPage)

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'anatomy_quiz' },
      select: { record_id: true },
    })

    const quizIds = records.map(r => r.record_id)

    if (!quizIds.length) {
      return { data: [], attachmentMap: new Map(), pagination: { page, perPage, isLastPage: true } }
    }

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where: { id: { in: quizIds } },
      include: {
        anatomy_quiz_tags: { include: { tags: { include: { tag_group: true } } } },
        anatomy_questions: { orderBy: { order: 'asc' } },
      },
      orderBy: { created_at: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = quizzes.length <= perPage
    const paginatedQuizzes = isLastPage ? quizzes : quizzes.slice(0, perPage)

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
