import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedDiagnosticCasesService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND (dz.title ILIKE ${`%${search.trim()}%`} OR dz.description ILIKE ${`%${search.trim()}%`} OR EXISTS (
            SELECT 1 FROM diagnostic_questions dq
            WHERE dq.quiz_id = dz.id AND dq.is_deleted = false
              AND dq.question ILIKE ${`%${search.trim()}%`}
          ))`
      : Prisma.empty

    // Scoped to version 1 on purpose — this list is the V1 → V2 migration inbox, showing
    // legacy diagnostic quizzes that were never attached to the node tree so an admin can
    // reshape one into a case and assign it to a subtopic. Version-2 cases are born
    // attached and are managed from their subtopic's detail page, so they don't belong
    // here. Same split as anatomy/v2/admin/getUnlinkedAnatomyQuizzesService.
    //
    // The row previews the vignette the case form will show, which for a V1 quiz is still
    // its `description` (the title comes along as a fallback so a quiz with no description
    // is still recognisable). Full detail is fetched separately when one is opened.
    const rawCases = await prisma.$queryRaw`
      SELECT dz.id,
             COALESCE(NULLIF(dz.description, ''), dz.title) AS vignette,
             (SELECT COUNT(*)::int FROM diagnostic_questions dq
              WHERE dq.quiz_id = dz.id AND dq.is_deleted = false) AS "questionCount"
      FROM diagnostic_quizzes dz
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'diagnostic_case' AND fnr.record_id = dz.id
      WHERE fnr.id IS NULL
        AND dz.is_deleted = false
        AND dz.version = 1
        ${searchFilter}
      ORDER BY dz.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawCases.length <= parseInt(perPage)
    const cases = rawCases.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    return { cases, pagination }
  }
}
