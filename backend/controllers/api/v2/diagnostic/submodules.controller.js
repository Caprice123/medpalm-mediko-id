import { GetDiagnosticSubmodulesService } from '#services/diagnostic/v2/getDiagnosticSubmodulesService'

class SubmodulesController {
  async index(req, res) {
    const { moduleId } = req.params
    const data = await GetDiagnosticSubmodulesService.call({ moduleId })
    res.json({ success: true, data })
  }
}

export default new SubmodulesController()
