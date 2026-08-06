import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'
const VISIBILITY = 'diagnostic'

export class GetDiagnosticProgressSubmodulesService extends BaseService {
  static async call({ userId, moduleId }) {
    const submodules = await prisma.feature_nodes.findMany({
      where: {
        parent_id: moduleId,
        layer: 2,
        visibility: VISIBILITY,
        node_type: 'submodule',
        // Match the same criteria as the browsable submodule list (GetDiagnosticSubmodulesService)
        node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
      },
      select: {
        id: true,
        name: true,
        node_statistics: { where: { record_type: RECORD_TYPE }, select: { total_count: true } },
      },
      orderBy: { name: 'asc' },
    })

    const submoduleIds = submodules.map(s => s.id)
    const progressRows = submoduleIds.length
      ? await prisma.user_node_progress.findMany({
          where: { user_id: userId, feature_type: RECORD_TYPE, node_id: { in: submoduleIds } },
        })
      : []
    const progressMap = new Map(progressRows.map(r => [r.node_id, r]))

    return submodules.map(s => {
      const p = progressMap.get(s.id)
      return {
        nodeId: s.id,
        nodeName: s.name,
        totalQuestions: s.node_statistics[0]?.total_count ?? 0,
        counts: {
          again: p?.again_count ?? 0,
          hard: p?.hard_count ?? 0,
          good: p?.good_count ?? 0,
          easy: p?.easy_count ?? 0,
        },
      }
    })
  }
}
