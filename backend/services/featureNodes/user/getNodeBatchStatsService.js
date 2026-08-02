import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeBatchStatsService extends BaseService {
  static async call({ nodeIds, type = 'flashcard_card' }) {
    if (!nodeIds) return {}
    const ids = String(nodeIds).split(',').map(Number).filter(Boolean)
    const rows = await prisma.node_statistics.findMany({
      where: { node_id: { in: ids }, record_type: type },
      select: { node_id: true, total_count: true },
    })
    return Object.fromEntries(rows.map(r => [r.node_id, r.total_count]))
  }
}
