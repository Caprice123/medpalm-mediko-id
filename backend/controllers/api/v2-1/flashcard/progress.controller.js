import { GetFlashcardDueTodayService } from '#services/flashcard/v2-1/getFlashcardDueTodayService'
import { GetFlashcardProgressSummaryService } from '#services/flashcard/v2-1/getFlashcardProgressSummaryService'
import { GetFlashcardProgressTopicsService } from '#services/flashcard/v2-1/getFlashcardProgressTopicsService'

class ProgressController {
  async getDueToday(req, res) {
    const userId = req.user.id
    const data = await GetFlashcardDueTodayService.call({ userId })
    return res.status(200).json({ data })
  }

  async getProgressSummary(req, res) {
    const userId = req.user.id
    const data = await GetFlashcardProgressSummaryService.call({ userId })
    return res.status(200).json({ data })
  }

  async getProgressTopics(req, res) {
    const userId = req.user.id
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 20
    const data = await GetFlashcardProgressTopicsService.call({ userId, cursor, limit })
    return res.status(200).json({ data })
  }
}

export default new ProgressController()
