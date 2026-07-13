import { GetUserFeatureNodesService } from '#services/featureNodes/user/getUserFeatureNodesService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'

class FeatureNodesController {
  async index(req, res) {
    const { nodeType, parentId, page, perPage } = req.query
    const result = await GetUserFeatureNodesService.call({
      nodeType,
      parentId: parentId !== undefined ? (parentId === 'null' ? null : parentId) : undefined,
      page,
      perPage,
    })
    res.json({ data: FeatureNodesSerializer.serializeList(result.data), pagination: result.pagination })
  }
}

export default new FeatureNodesController()
