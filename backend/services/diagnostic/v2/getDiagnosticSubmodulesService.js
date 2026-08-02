import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const VISIBILITY = 'diagnostic'
const RECORD_TYPE = 'diagnostic_question'

export class GetDiagnosticSubmodulesService extends BaseService {
  static async call({ moduleId }) {
    const submodules = await prisma.feature_nodes.findMany({
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
      orderBy: { name: 'asc' },
    })

    return submodules.map(s => ({
      ...s,
      questionCount: s.node_statistics[0]?.total_count ?? 0,
    }))
  }
}
