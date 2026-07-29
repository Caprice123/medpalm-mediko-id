import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { AtlasQuizAtlasModelListSerializer } from '#serializers/api/v2/atlasQuizAtlasModelListSerializer'

export class GetAtlasQuizAtlasModelsService extends BaseService {
  static async call({ slug, module, page = 1, perPage = 9 }) {
    const topic = await prisma.feature_nodes.findUnique({ where: { slug } })
    if (!topic) throw new ValidationError('Topik tidak ditemukan')

    const currentPage = Math.max(1, parseInt(page) || 1)
    const currentPerPage = Math.min(100, Math.max(1, parseInt(perPage) || 9))
    const emptyPagination = { page: currentPage, perPage: currentPerPage, isLastPage: true }

    const rows = await this.fetchPage(topic.id, module, currentPage, currentPerPage)
    if (rows.length === 0) return { data: [], pagination: emptyPagination }

    const isLastPage = rows.length <= currentPerPage
    const pageRows = rows.slice(0, currentPerPage)

    const pageModuleIds = [...new Set(pageRows.map(r => Number(r.moduleId)))]
    const quizStats = await this.fetchQuizStats(pageModuleIds)
    const quizCountMap = Object.fromEntries(quizStats.map(s => [s.node_id, s.total_count]))

    return {
      data: pageRows.map(row => AtlasQuizAtlasModelListSerializer.serialize(row, quizCountMap)),
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
        fn.id            AS "moduleId",
        fn.name          AS "moduleName",
        fn.classification,
        am.unique_id     AS "uniqueId",
        am.title,
        am.description
      FROM feature_nodes fn
      INNER JOIN feature_node_records fnr
        ON fnr.node_id = fn.id AND fnr.record_type = '3d_atlas'
      INNER JOIN atlas_models am
        ON am.id = fnr.record_id AND am.status = 'published' AND am.is_deleted = false
      WHERE fn.parent_id = ${topicId}
        AND fn.layer = 2
        ${filterClause}
      ORDER BY fn.name ASC, am.title ASC
      LIMIT ${perPage + 1} OFFSET ${offset}
    `
  }

  static async fetchQuizStats(moduleIds) {
    return prisma.node_statistics.findMany({
      where: { node_id: { in: moduleIds }, record_type: 'anatomy_quiz' },
    })
  }
}
