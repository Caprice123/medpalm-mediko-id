import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'
const VISIBILITY = 'diagnostic'
const DEFAULT_LIMIT = 20

export class GetDiagnosticProgressModulesService extends BaseService {
  static async call({ userId, cursor = null, limit = DEFAULT_LIMIT }) {
    const rows = await prisma.user_node_progress.findMany({
      where: {
        user_id: userId,
        feature_type: RECORD_TYPE,
        ...(cursor ? { id: { gt: cursor } } : {}),
        // Match the same criteria as the browsable module list (GetDiagnosticCategoriesService) —
        // a progress row can outlive its module being unpublished, retyped, or emptied out.
        feature_nodes: {
          visibility: VISIBILITY,
          node_type: 'module',
          children: {
            some: {
              node_type: 'submodule',
              node_statistics: { some: { record_type: RECORD_TYPE, total_count: { gt: 0 } } },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
      take: limit + 1,
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

    const isLastPage = rows.length <= limit
    const page = isLastPage ? rows : rows.slice(0, limit)
    const nextCursor = isLastPage ? null : page[page.length - 1].id

    const modules = page
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

    return { modules, nextCursor }
  }
}
