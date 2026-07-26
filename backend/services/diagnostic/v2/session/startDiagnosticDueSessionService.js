import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { buildDiagnosticSessionCards } from '#services/diagnostic/v2/session/buildDiagnosticSessionCards'

const RECORD_TYPE = 'diagnostic_question'

export class StartDiagnosticDueSessionService extends BaseService {
  static async call({ userId, count }) {
    const now = new Date()

    const dueStates = await prisma.user_review_states.findMany({
      where: { user_id: userId, record_type: RECORD_TYPE, due_date: { lte: now } },
      select: { record_id: true },
    })

    if (dueStates.length === 0) return []

    const dueIds = dueStates.map(s => s.record_id)
    const shuffled = [...dueIds].sort(() => Math.random() - 0.5)
    const limit = count ? Math.min(parseInt(count), shuffled.length) : shuffled.length
    const selected = shuffled.slice(0, limit)

    return buildDiagnosticSessionCards({ selected, newIdSet: new Set(), node: null })
  }
}
