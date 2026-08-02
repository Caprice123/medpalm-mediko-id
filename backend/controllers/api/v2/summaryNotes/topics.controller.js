import { GetSummaryNoteTopicsService } from '#services/summaryNotes/v2/getSummaryNoteTopicsService'

class TopicsController {
  async getTopics(req, res) {
    const { classification } = req.query
    const topics = await GetSummaryNoteTopicsService.call({ classification })
    return res.json({ data: topics })
  }
}

export default new TopicsController()
