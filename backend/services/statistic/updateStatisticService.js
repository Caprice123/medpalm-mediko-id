import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateStatisticService extends BaseService {
  /**
   * Increment a statistic value by a given amount
   * @param {string} key - The statistic key
   * @param {number} amount - Amount to increment (default: 1)
   */
  static async increment(key, amount = 1) {
    return await prisma.statistics.upsert({
      where: { key },
      update: {
        value: { increment: amount }
      },
      create: {
        key,
        value: amount
      }
    })
  }

  /**
   * Decrement a statistic value by a given amount
   * @param {string} key - The statistic key
   * @param {number} amount - Amount to decrement (default: 1)
   */
  static async decrement(key, amount = 1) {
    const stat = await prisma.statistics.findUnique({ where: { key } })
    if (!stat) return null

    const newValue = Math.max(0, stat.value - amount)
    return await prisma.statistics.update({
      where: { key },
      data: { value: newValue }
    })
  }

  /**
   * Set a statistic to a specific value
   * @param {string} key - The statistic key
   * @param {number} value - The value to set
   */
  static async set(key, value) {
    return await prisma.statistics.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    })
  }

  /**
   * Initialize statistics by counting from existing tables
   * Call this once to seed initial values
   */
  static async initialize() {
    const [
      totalUsers,
      totalSessions,
      totalFlashcards,
      totalQuestions,
      totalSummaryNotes
    ] = await Promise.all([
      prisma.users.count({ where: { is_active: true } }),
      prisma.user_learning_sessions.count(),
      prisma.flashcard_cards.count(),
      prisma.exercise_questions.count(),
      prisma.summary_notes.count({ where: { is_active: true } })
    ])

    await Promise.all([
      this.set('total_users', totalUsers),
      this.set('total_sessions', totalSessions),
      this.set('total_flashcards', totalFlashcards),
      this.set('total_questions', totalQuestions),
      this.set('total_summary_notes', totalSummaryNotes),
      this.set('satisfaction_rate', 95)
    ])

    return {
      totalUsers,
      totalSessions,
      totalFlashcards,
      totalQuestions,
      totalSummaryNotes,
      satisfactionRate: 95
    }
  }
}

// Statistic keys constants
export const STAT_KEYS = {
  TOTAL_USERS: 'total_users',
  TOTAL_SESSIONS: 'total_sessions',
  TOTAL_FLASHCARDS: 'total_flashcards',
  TOTAL_QUESTIONS: 'total_questions',
  TOTAL_SUMMARY_NOTES: 'total_summary_notes',
  SATISFACTION_RATE: 'satisfaction_rate'
}
