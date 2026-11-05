import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedDiagnosticCasesService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND (dc.vignette ILIKE ${`%${search.trim()}%`} OR EXISTS (
            SELECT 1 FROM diagnostic_questions dq
            WHERE dq.case_id = dc.id AND dq.is_deleted = false
              AND dq.question ILIKE ${`%${search.trim()}%`}
          ))`
      : Prisma.empty

    // List view is lightweight — the vignette snippet plus a question count. Full detail
    // is fetched separately when a case is opened for edit.
    const rawCases = await prisma.$queryRaw`
      SELECT dc.id,
             dc.vignette,
             (SELECT COUNT(*)::int FROM diagnostic_questions dq
              WHERE dq.case_id = dc.id AND dq.is_deleted = false) AS "questionCount"
      FROM diagnostic_cases dc
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'diagnostic_case' AND fnr.record_id = dc.id
      WHERE fnr.id IS NULL
        AND dc.is_deleted = false
        ${searchFilter}
      ORDER BY dc.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawCases.length <= parseInt(perPage)
    const cases = rawCases.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    return { cases, pagination }
  }
}
