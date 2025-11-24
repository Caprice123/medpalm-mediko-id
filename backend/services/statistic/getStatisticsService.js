import prisma from '../../prisma/client.js'
import { BaseService } from '../baseService.js'
import { STAT_KEYS } from './updateStatisticService.js'

export class GetStatisticsService extends BaseService {
  static async call() {
    // Get all statistics from the table
    const stats = await prisma.statistics.findMany()

    // Convert to object for easy access
    const statsMap = {}
    stats.forEach(stat => {
      statsMap[stat.key] = stat.value
    })

    return {
      totalUsers: statsMap[STAT_KEYS.TOTAL_USERS] || 0,
      totalSessions: statsMap[STAT_KEYS.TOTAL_SESSIONS] || 0,
      totalFlashcards: statsMap[STAT_KEYS.TOTAL_FLASHCARDS] || 0,
      totalQuestions: statsMap[STAT_KEYS.TOTAL_QUESTIONS] || 0,
      totalSummaryNotes: statsMap[STAT_KEYS.TOTAL_SUMMARY_NOTES] || 0,
      satisfactionRate: statsMap[STAT_KEYS.SATISFACTION_RATE] || 95
    }
  }
}
