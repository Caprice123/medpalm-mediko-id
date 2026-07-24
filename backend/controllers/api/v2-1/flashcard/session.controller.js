import { StartFlashcardNodeSessionService } from '#services/flashcard/v2-1/session/startFlashcardNodeSessionService'
import { StartFlashcardCustomSessionService } from '#services/flashcard/v2-1/session/custom/startFlashcardCustomSessionService'
import { StartFlashcardDueSessionService } from '#services/flashcard/v2-1/session/due/startFlashcardDueSessionService'
import { StartFlashcardNodeDueSessionService } from '#services/flashcard/v2-1/session/due/startFlashcardNodeDueSessionService'

class SessionController {
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

export default new SessionController()
