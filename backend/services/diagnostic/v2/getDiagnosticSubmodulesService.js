import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VISIBILITY = 'diagnostic'
const RECORD_TYPE = 'diagnostic_question'
const DEFAULT_LIMIT = 50

export class GetDiagnosticSubmodulesService extends BaseService {
  // cursor here is an offset (count of items already fetched), not a row id — an id-based
  // cursor would sort by id and silently break the admin-curated order/name sort below.
  static async call({ moduleId, cursor = null, limit = DEFAULT_LIMIT }) {
    const skip = cursor ?? 0

    const rows = await prisma.feature_nodes.findMany({
      where: {
        parent_id: parseInt(moduleId),
        layer: 2,
        visibility: VISIBILITY,
        node_type: 'submodule',
        node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
      },
      include: {
        node_statistics: {
          where: { record_type: RECORD_TYPE },
          select: { total_count: true },
        },
      },
      orderBy: [{ order: { sort: 'asc', nulls: 'last' } }, { name: 'asc' }],
      skip,
      take: limit + 1,
    })

    const isLastPage = rows.length <= limit
    const page = isLastPage ? rows : rows.slice(0, limit)
    const nextCursor = isLastPage ? null : skip + limit

    const submodules = page.map(s => ({
      ...s,
      questionCount: s.node_statistics[0]?.total_count ?? 0,
    }))

    return { submodules, nextCursor }
  }
}
