import { GetDiagnosticDueTodayService } from '#services/diagnostic/v2/getDiagnosticDueTodayService'
import { GetDiagnosticProgressSummaryService } from '#services/diagnostic/v2/getDiagnosticProgressSummaryService'
import { GetDiagnosticProgressTopicsService } from '#services/diagnostic/v2/getDiagnosticProgressTopicsService'

class ProgressController {
  async getDueToday(req, res) {
    const data = await GetDiagnosticDueTodayService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }

  async getProgressSummary(req, res) {
    const data = await GetDiagnosticProgressSummaryService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }

  async getProgressTopics(req, res) {
    const data = await GetDiagnosticProgressTopicsService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }
}

export default new ProgressController()
