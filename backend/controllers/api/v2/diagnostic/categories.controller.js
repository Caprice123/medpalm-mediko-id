import { GetDiagnosticCategoriesService } from '#services/diagnostic/v2/getDiagnosticCategoriesService'

class CategoriesController {
  async index(req, res) {
    const { classification } = req.query
    const data = await GetDiagnosticCategoriesService.call({ classification })
    res.json({ success: true, data })
  }
}

export default new CategoriesController()
