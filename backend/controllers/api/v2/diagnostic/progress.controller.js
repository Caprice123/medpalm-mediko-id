import { GetDiagnosticDueTodayService } from '#services/diagnostic/v2/getDiagnosticDueTodayService'
import { GetDiagnosticProgressSummaryService } from '#services/diagnostic/v2/getDiagnosticProgressSummaryService'
import { GetDiagnosticProgressModulesService } from '#services/diagnostic/v2/getDiagnosticProgressModulesService'
import { GetDiagnosticProgressSubmodulesService } from '#services/diagnostic/v2/getDiagnosticProgressSubmodulesService'

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
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 20
    const data = await GetDiagnosticProgressModulesService.call({ userId: req.user.id, cursor, limit })
    res.json({ success: true, data })
  }

  async getProgressSubmodules(req, res) {
    const moduleId = parseInt(req.params.moduleId)
    const data = await GetDiagnosticProgressSubmodulesService.call({ userId: req.user.id, moduleId })
    res.json({ success: true, data })
  }
}

export default new ProgressController()
