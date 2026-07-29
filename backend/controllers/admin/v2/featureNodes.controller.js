import { GetFeatureNodesWithStatsService } from '#services/featureNodes/admin/getFeatureNodesWithStatsService'
import { FeatureNodesV2Serializer } from '#serializers/admin/v2/featureNodesSerializer'

class FeatureNodesV2Controller {
  async index(req, res) {
    const { search, nodeType, parentId, layer, visibility, classification } = req.query
    const nodes = await GetFeatureNodesWithStatsService.call({
      search,
      nodeType,
      parentId: parentId === 'null' ? null : parentId,
      layer,
      visibility,
      classification,
    })
    return res.status(200).json({ data: FeatureNodesV2Serializer.serializeList(nodes) })
  }
}

export default new FeatureNodesV2Controller()
