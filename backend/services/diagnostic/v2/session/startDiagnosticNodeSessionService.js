import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { buildDiagnosticSessionCards } from '#services/diagnostic/v2/session/buildDiagnosticSessionCards'

const RECORD_TYPE = 'diagnostic_question'

export class StartDiagnosticNodeSessionService extends BaseService {
  static async call({ userId, nodeId, count }) {
    const node = await prisma.feature_nodes.findUnique({
      where: { id: parseInt(nodeId) },
      include: { parent: { select: { id: true, name: true } } },
    })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    const allRefs = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: RECORD_TYPE },
      select: { record_id: true },
    })

    if (allRefs.length === 0) return []

    const questionIds = allRefs.map(r => r.record_id)

    const seenLogs = await prisma.user_learned_items.findMany({
      where: { user_id: userId, item_type: RECORD_TYPE, item_id: { in: questionIds } },
      select: { item_id: true },
    })
    const seenIdSet = new Set(seenLogs.map(l => l.item_id))

    const newIds  = questionIds.filter(id => !seenIdSet.has(id))
    const seenIds = questionIds.filter(id =>  seenIdSet.has(id))

    const limit = parseInt(count) || questionIds.length
    const selected = [
      ...newIds.sort(() => Math.random() - 0.5),
      ...seenIds.sort(() => Math.random() - 0.5),
    ].slice(0, limit)

    return buildDiagnosticSessionCards({ selected, newIdSet: new Set(newIds), node })
  }
}
