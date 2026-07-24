import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const DEFAULT_LIMIT = 20

export class GetFlashcardProgressTopicsService extends BaseService {
  static async call({ userId, cursor = null, limit = DEFAULT_LIMIT }) {
    const rows = await prisma.user_node_progress.findMany({
      where: {
        user_id: userId,
        feature_type: 'flashcard_card',
        ...(cursor ? { id: { gt: cursor } } : {}),
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
            classification: true,
            children: {
              select: {
                node_statistics: {
                  where: { record_type: 'flashcard_card' },
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

    const topics = page
      .map(r => {
        const node = r.feature_nodes
        const totalCards = node.children.reduce(
          (sum, child) => sum + (child.node_statistics[0]?.total_count ?? 0),
          0
        )
        return {
          nodeId:         node.id,
          nodeName:       node.name,
          classification: node.classification,
          totalCards,
          counts: {
            again: r.again_count,
            hard:  r.hard_count,
            good:  r.good_count,
            easy:  r.easy_count,
          },
        }
      })
      .sort((a, b) => a.nodeName.localeCompare(b.nodeName, 'id'))

    return { topics, nextCursor }
  }
}
