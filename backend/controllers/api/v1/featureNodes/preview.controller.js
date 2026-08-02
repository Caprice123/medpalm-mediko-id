import { GetNodePreviewService } from '#services/featureNodes/user/getNodePreviewService'

class PreviewController {
  async preview(req, res) {
    const { id } = req.params
    const { type } = req.query
    const items = await GetNodePreviewService.call({ nodeId: id, type })
    return res.json({ data: items })
  }
}

export default new PreviewController()
