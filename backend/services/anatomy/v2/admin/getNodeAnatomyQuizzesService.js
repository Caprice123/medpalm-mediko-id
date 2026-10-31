import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import attachmentService from '#services/attachment/attachmentService'

export class GetNodeAnatomyQuizzesService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    page = parseInt(page)
    perPage = parseInt(perPage)

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'anatomy_quiz' },
      orderBy: [{ order: { sort: 'asc', nulls: 'last' } }, { created_at: 'asc' }],
      select: { record_id: true },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = records.length <= perPage
    const pageRecords = isLastPage ? records : records.slice(0, perPage)
    const quizIds = pageRecords.map(r => r.record_id)

    if (!quizIds.length) {
      return { data: [], attachmentMap: new Map(), pagination: { page, perPage, isLastPage: true } }
    }

    const quizzes = await prisma.anatomy_quizzes.findMany({
      where: { id: { in: quizIds } },
      include: {
        anatomy_quiz_tags: { include: { tags: { include: { tag_group: true } } } },
        anatomy_questions: { orderBy: { order: 'asc' } },
      },
    })

    // findMany({ id: { in } }) does not preserve input order — resort to match
    // the feature_node_records order the pagination above was actually built on.
    const quizzesById = new Map(quizzes.map(q => [q.id, q]))
    const orderedQuizzes = quizIds.map(id => quizzesById.get(id)).filter(Boolean)

    const attachmentMap = await attachmentService.getBulkAttachmentsWithUrls(
      orderedQuizzes.map(quiz => ({ recordType: 'anatomy_quiz', recordId: quiz.id, name: 'image' }))
    )

    return {
      data: orderedQuizzes,
      attachmentMap,
      pagination: { page, perPage, isLastPage },
    }
  }
}
