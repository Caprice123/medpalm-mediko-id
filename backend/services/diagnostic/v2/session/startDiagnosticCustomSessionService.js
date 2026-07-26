import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { buildDiagnosticSessionCards } from '#services/diagnostic/v2/session/buildDiagnosticSessionCards'

const RECORD_TYPE = 'diagnostic_question'

export class StartDiagnosticCustomSessionService extends BaseService {
  static async call({ userId, nodeIds, count }) {
    if (!nodeIds?.length) throw new ValidationError('Pilih minimal satu sub-topik')

    const parsedIds = nodeIds.map(id => parseInt(id))

    const allRefs = await prisma.feature_node_records.findMany({
      where: { node_id: { in: parsedIds }, record_type: RECORD_TYPE },
      select: { record_id: true, node_id: true },
    })

    if (allRefs.length === 0) return []

    const refToNodeId = new Map(allRefs.map(r => [r.record_id, r.node_id]))
    const questionIds = allRefs.map(r => r.record_id)

    const seenLogs = await prisma.user_learned_items.findMany({
      where: { user_id: userId, item_type: RECORD_TYPE, item_id: { in: questionIds } },
      select: { item_id: true },
    })
    const seenIdSet = new Set(seenLogs.map(l => l.item_id))

    const newIds  = questionIds.filter(id => !seenIdSet.has(id))
    const seenIds = questionIds.filter(id =>  seenIdSet.has(id))

    const limit = Math.min(parseInt(count) || questionIds.length, questionIds.length)
    const selected = [
      ...newIds.sort(() => Math.random() - 0.5),
      ...seenIds.sort(() => Math.random() - 0.5),
    ].slice(0, limit)

    const nodes = await prisma.feature_nodes.findMany({
      where: { id: { in: parsedIds } },
      select: { id: true, name: true, parent: { select: { id: true, name: true } } },
    })
    const nodeInfoMap = new Map(nodes.map(n => [n.id, n]))
    const nodeMap = new Map(selected.map(id => [id, nodeInfoMap.get(refToNodeId.get(id))]))

    return buildDiagnosticSessionCards({ selected, newIdSet: new Set(newIds), nodeMap })
  }
}
