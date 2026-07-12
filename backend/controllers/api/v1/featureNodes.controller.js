import { GetFeatureNodesService } from '#services/featureNodes/admin/getFeatureNodesService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'

class FeatureNodesController {
  async index(req, res) {
    const { nodeType, parentId } = req.query
    const nodes = await GetFeatureNodesService.call({
      nodeType,
      parentId: parentId !== undefined ? (parentId === 'null' ? null : parentId) : undefined,
    })
    res.json({ data: FeatureNodesSerializer.serializeList(nodes) })
  }
}

export default new FeatureNodesController()
