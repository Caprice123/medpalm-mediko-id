import { RateDiagnosticQuestionService } from '#services/diagnostic/v2/rate/rateDiagnosticQuestionService'

class RateController {
  async create(req, res) {
    const { recordId, rating } = req.body
    await RateDiagnosticQuestionService.call({ userId: req.user.id, recordId: parseInt(recordId), rating })
    res.json({ success: true })
  }
}

export default new RateController()
