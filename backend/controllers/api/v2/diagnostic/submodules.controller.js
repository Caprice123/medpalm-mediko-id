import { GetDiagnosticSubmodulesService } from '#services/diagnostic/v2/getDiagnosticSubmodulesService'

class SubmodulesController {
  async index(req, res) {
    const { moduleId } = req.params
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 50
    const data = await GetDiagnosticSubmodulesService.call({ moduleId, cursor, limit })
    res.json({ success: true, data })
  }
}

export default new SubmodulesController()
