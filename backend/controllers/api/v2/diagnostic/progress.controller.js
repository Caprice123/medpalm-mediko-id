import { GetDiagnosticDueTodayService } from '#services/diagnostic/v2/getDiagnosticDueTodayService'
import { GetDiagnosticProgressSummaryService } from '#services/diagnostic/v2/getDiagnosticProgressSummaryService'
import { GetDiagnosticProgressModulesService } from '#services/diagnostic/v2/getDiagnosticProgressModulesService'

class ProgressController {
  async getDueToday(req, res) {
    const data = await GetDiagnosticDueTodayService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }

  async getProgressSummary(req, res) {
    const data = await GetDiagnosticProgressSummaryService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }

  async getProgressModules(req, res) {
    const data = await GetDiagnosticProgressModulesService.call({ userId: req.user.id })
    res.json({ success: true, data })
  }
}

export default new ProgressController()
