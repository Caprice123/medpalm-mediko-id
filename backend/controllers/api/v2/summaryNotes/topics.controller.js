import { GetSummaryNoteTopicsService } from '#services/summaryNotes/v2/getSummaryNoteTopicsService'

class TopicsController {
  async getTopics(req, res) {
    const { classification, page, perPage } = req.query
    const data = await GetSummaryNoteTopicsService.call({ classification, page, perPage })
    return res.json({ data })
  }
}

export default new TopicsController()
