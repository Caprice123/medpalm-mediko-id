import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetFlashcardProgressSummaryService extends BaseService {
  static async call({ userId }) {
    const stats = await prisma.user_feature_statistics.findMany({
      where: { user_id: userId, feature: 'flashcard_card' },
      select: { statistic_type: true, statistic_count: true },
    })

    const countMap = Object.fromEntries(stats.map(s => [s.statistic_type, s.statistic_count]))
    return {
      again: countMap.again ?? 0,
      hard:  countMap.hard  ?? 0,
      good:  countMap.good  ?? 0,
      easy:  countMap.easy  ?? 0,
    }
  }
}
