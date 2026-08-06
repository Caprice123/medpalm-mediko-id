import { GetSummaryNoteSubtopicsService } from '#services/summaryNotes/v2/getSummaryNoteSubtopicsService'

class SubtopicsController {
  async getSubtopics(req, res) {
    const { topicId } = req.params
    const { page, perPage } = req.query
    const data = await GetSummaryNoteSubtopicsService.call({ topicId, page, perPage })
    return res.json({ data })
  }
}

export default new SubtopicsController()
