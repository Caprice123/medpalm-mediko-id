import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { buildDiagnosticSessionCards } from '#services/diagnostic/v2/session/buildDiagnosticSessionCards'

const RECORD_TYPE = 'diagnostic_question'

export class StartDiagnosticNodeDueSessionService extends BaseService {
  static async call({ userId, nodeId }) {
    const now = new Date()

    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    const refs = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: RECORD_TYPE },
      select: { record_id: true },
    })
    const nodeQuestionIds = new Set(refs.map(r => r.record_id))

    const dueStates = await prisma.user_review_states.findMany({
      where: {
        user_id: userId,
        record_type: RECORD_TYPE,
        due_date: { lte: now },
        record_id: { in: [...nodeQuestionIds] },
      },
      select: { record_id: true },
    })

    if (dueStates.length === 0) return []

    const selected = dueStates.map(s => s.record_id)

    return buildDiagnosticSessionCards({ selected, newIdSet: new Set(), node })
  }
}
