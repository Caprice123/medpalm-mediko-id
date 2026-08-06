import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { AtlasQuizAnatomyQuizListSerializer } from '#serializers/api/v2/atlasQuizAnatomyQuizListSerializer'

export class GetAtlasQuizAnatomyQuizzesService extends BaseService {
  static async call({ slug, module, page = 1, perPage = 10 }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 30))
    const emptyPagination = { page: currentPage, perPage: currentPerPage, isLastPage: true }

    const rows = await this.fetchPage(topic.id, module, currentPage, currentPerPage)
    if (rows.length === 0) return { data: [], pagination: emptyPagination }

    const isLastPage = rows.length <= currentPerPage
    const pageRows = rows.slice(0, currentPerPage)

    return {
      data: pageRows.map(AtlasQuizAnatomyQuizListSerializer.serialize),
      pagination: { page: currentPage, perPage: currentPerPage, isLastPage },
    }
  }

  static async fetchPage(topicId, moduleFilter, page, perPage) {
    const offset = (page - 1) * perPage
    const filterClause = moduleFilter
      ? Prisma.sql`AND fn.name ILIKE ${'%' + moduleFilter + '%'}`
      : Prisma.empty

    return prisma.$queryRaw`
      SELECT
        fn.id              AS "moduleId",
        fn.name            AS "moduleName",
        fn.classification,
        aq.unique_id       AS "uniqueId",
        aq.title,
        aq.description,
        aq.question_count  AS "questionCount",
        aq.difficulty,
        aq.estimated_minutes AS "estimatedMinutes"
      FROM feature_nodes fn
      INNER JOIN feature_node_records fnr
        ON fnr.node_id = fn.id AND fnr.record_type = 'anatomy_quiz'
      INNER JOIN anatomy_quizzes aq
        ON aq.id = fnr.record_id AND aq.status = 'published' AND aq.is_deleted = false
      WHERE fn.parent_id = ${topicId}
        AND fn.layer = 2
        AND fn.node_type = 'module'
        ${filterClause}
      ORDER BY fn.name ASC, fnr.order ASC NULLS LAST, aq.title ASC
      LIMIT ${perPage + 1} OFFSET ${offset}
    `
  }

}
