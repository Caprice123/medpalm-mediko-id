import { GetSummaryNoteSubtopicsService } from '#services/summaryNotes/v2/getSummaryNoteSubtopicsService'

class SubtopicsController {
  async getSubtopics(req, res) {
    const { topicId } = req.params
    const subtopics = await GetSummaryNoteSubtopicsService.call({ topicId })
    return res.json({ data: subtopics })
  }
}

export default new SubtopicsController()
