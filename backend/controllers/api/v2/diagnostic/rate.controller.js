import { RateDiagnosticCaseService } from '#services/diagnostic/v2/rate/rateDiagnosticCaseService'

class RateController {
  async create(req, res) {
    const { recordId, rating } = req.body
    await RateDiagnosticCaseService.call({ userId: req.user.id, recordId: parseInt(recordId), rating })
    res.json({ success: true })
  }
}

export default new RateController()
