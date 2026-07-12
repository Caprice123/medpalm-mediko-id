import { SubmitUserReviewStateService } from '#services/review/submitUserReviewStateService'
import { GetReviewSessionService } from '#services/review/getReviewSessionService'
import { GetReviewStatsService } from '#services/review/getReviewStatsService'
import { CreateCustomSessionService } from '#services/review/createCustomSessionService'
import { GetCustomSessionsService } from '#services/review/getCustomSessionsService'
import { DeleteCustomSessionService } from '#services/review/deleteCustomSessionService'

class ReviewV2Controller {
  async submitRating(req, res) {
    const { recordType, recordId, rating } = req.body
    await SubmitUserReviewStateService.call({
      userId: req.user.id,
      recordType,
      recordId: parseInt(recordId),
      rating,
    })
    return res.status(200).json({ data: { message: 'Rating tersimpan' } })
  }

  async getSession(req, res) {
    const { recordType, nodeId, departmentNodeId, mode, limit, lastRating } = req.query
    const cards = await GetReviewSessionService.call({
      userId: req.user.id,
      recordType,
      nodeId,
      departmentNodeId,
      mode,
      limit,
      lastRating,
    })
    return res.status(200).json({ data: cards })
  }

  async listCustomSessions(req, res) {
    const sessions = await GetCustomSessionsService.call({ userId: req.user.id })
    return res.status(200).json({ data: sessions })
  }

  async createCustomSession(req, res) {
    const { name, recordType, nodeId, departmentNodeId, mode, cardLimit } = req.body
    const session = await CreateCustomSessionService.call({
      userId: req.user.id,
      name, recordType, nodeId, departmentNodeId, mode, cardLimit,
    })
    return res.status(201).json({ data: session })
  }

  async deleteCustomSession(req, res) {
    await DeleteCustomSessionService.call({ userId: req.user.id, sessionId: req.params.id })
    return res.status(200).json({ data: { message: 'Sesi dihapus' } })
  }

  async getStats(req, res) {
    const stats = await GetReviewStatsService.call({ userId: req.user.id })
    return res.status(200).json({ data: stats })
  }
}

export default new ReviewV2Controller()
