import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'
const VISIBILITY = 'diagnostic'

export class GetDiagnosticProgressModulesService extends BaseService {
  static async call({ userId }) {
    const rows = await prisma.user_node_progress.findMany({
      where: { user_id: userId, feature_type: RECORD_TYPE },
      select: {
        id: true,
        again_count: true,
        hard_count: true,
        good_count: true,
        easy_count: true,
        feature_nodes: {
          select: {
            id: true,
            name: true,
            visibility: true,
            node_type: true,
            children: {
              where: { node_type: 'submodule' },
              select: {
                node_statistics: {
                  where: { record_type: RECORD_TYPE },
                  select: { total_count: true },
                },
              },
            },
          },
        },
      },
    })

    const modules = rows
      .filter(r => r.feature_nodes?.visibility === VISIBILITY && r.feature_nodes?.node_type === 'module')
      .map(r => {
        const node = r.feature_nodes
        const totalQuestions = node.children.reduce(
          (sum, child) => sum + (child.node_statistics[0]?.total_count ?? 0),
          0
        )
        return {
          nodeId: node.id,
          nodeName: node.name,
          totalQuestions,
          counts: {
            again: r.again_count,
            hard: r.hard_count,
            good: r.good_count,
            easy: r.easy_count,
          },
        }
      })
      .sort((a, b) => a.nodeName.localeCompare(b.nodeName, 'id'))

    return { modules }
  }
}
