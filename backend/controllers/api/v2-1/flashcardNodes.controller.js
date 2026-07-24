import { GetFlashcardTopicsService } from '#services/flashcard/v2-1/getFlashcardTopicsService'
import { GetFlashcardSubtopicsService } from '#services/flashcard/v2-1/getFlashcardSubtopicsService'
import { StartFlashcardNodeSessionService } from '#services/flashcard/v2-1/session/startFlashcardNodeSessionService'
import { StartFlashcardCustomSessionService } from '#services/flashcard/v2-1/session/custom/startFlashcardCustomSessionService'
import { GetFlashcardDueTodayService } from '#services/flashcard/v2-1/getFlashcardDueTodayService'
import { GetFlashcardProgressSummaryService } from '#services/flashcard/v2-1/getFlashcardProgressSummaryService'
import { GetFlashcardProgressTopicsService } from '#services/flashcard/v2-1/getFlashcardProgressTopicsService'
import { GetFlashcardProgressService } from '#services/flashcard/v2-1/getFlashcardProgressService'
import { StartFlashcardDueSessionService } from '#services/flashcard/v2-1/startFlashcardDueSessionService'
import { StartFlashcardNodeDueSessionService } from '#services/flashcard/v2-1/startFlashcardNodeDueSessionService'

class FlashcardNodesController {
  async getTopics(req, res) {
    const topics = await GetFlashcardTopicsService.call()
    return res.status(200).json({
      data: topics.map(t => ({
        id: t.id,
        name: t.name,
        classification: t.classification,
        cardCount: t.cardCount,
      })),
    })
  }

  async getSubtopics(req, res) {
    const { topicId } = req.params
    const subtopics = await GetFlashcardSubtopicsService.call({ topicId })
    return res.status(200).json({
      data: subtopics.map(s => ({
        id: s.id,
        name: s.name,
        cardCount: s.cardCount,
      })),
    })
  }

  async startSession(req, res) {
    const userId = req.user.id
    const { nodeId, count } = req.body
    const cards = await StartFlashcardNodeSessionService.call({ userId, nodeId, count })
    return res.status(200).json({ data: cards })
  }

  async startCustomSession(req, res) {
    const userId = req.user.id
    const { nodeIds, count } = req.body
    const cards = await StartFlashcardCustomSessionService.call({ userId, nodeIds, count })
    return res.status(200).json({ data: cards })
  }

  async getDueToday(req, res) {
    const userId = req.user.id
    const data = await GetFlashcardDueTodayService.call({ userId })
    return res.status(200).json({ data })
  }

  async getProgress(req, res) {
    const userId = req.user.id
    const data = await GetFlashcardProgressService.call({ userId })
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

  async startDueSession(req, res) {
    const userId = req.user.id
    const { count } = req.body
    const cards = await StartFlashcardDueSessionService.call({ userId, count })
    return res.status(200).json({ data: cards })
  }

  async startNodeDueSession(req, res) {
    const userId = req.user.id
    const { nodeId, count } = req.body
    const cards = await StartFlashcardNodeDueSessionService.call({ userId, nodeId, count })
    return res.status(200).json({ data: cards })
  }
}

export default new FlashcardNodesController()
