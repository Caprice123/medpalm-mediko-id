import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const RECORD_TYPE = 'diagnostic_question'

export class GetDiagnosticProgressSummaryService extends BaseService {
  static async call({ userId }) {
    const rows = await prisma.user_feature_statistics.findMany({
      where: { user_id: userId, feature: RECORD_TYPE },
    })

    const counts = { again: 0, hard: 0, good: 0, easy: 0 }
    for (const r of rows) {
      if (counts[r.statistic_type] !== undefined) {
        counts[r.statistic_type] = r.statistic_count
      }
    }

    return counts
  }
}
