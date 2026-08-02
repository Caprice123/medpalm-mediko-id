import { GetDiagnosticSubtopicsService } from '#services/diagnostic/v2/getDiagnosticSubtopicsService'

class SubtopicsController {
  async index(req, res) {
    const { topicId } = req.params
    const data = await GetDiagnosticSubtopicsService.call({ topicId })
    res.json({ success: true, data })
  }
}

export default new SubtopicsController()
