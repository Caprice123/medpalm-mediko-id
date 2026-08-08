import { GetUserFeatureNodesService } from '#services/featureNodes/user/getUserFeatureNodesService'
import { UserFeatureNodesSerializer } from '#serializers/api/v1/userFeatureNodesSerializer'

class NodesController {
  async index(req, res) {
    const { id, name, nodeType, parentId, parentSlug, slug, visibility, classification, layer, hasContent, includeAdjacent, page, perPage } = req.query
    const result = await GetUserFeatureNodesService.call({
      id,
      name,
      nodeType,
      parentId: parentId !== undefined ? (parentId === 'null' ? null : parentId) : undefined,
      parentSlug,
      slug,
      visibility,
      classification,
      layer,
      hasContent,
      includeAdjacent,
      page,
      perPage,
      username: req.user?.name ?? null,
    })

    res.json({
      data: UserFeatureNodesSerializer.serializeList(result.data, result.videoEmbedUrlMap, result.adjacentMap),
      pagination: result.pagination,
    })
  }
}

export default new NodesController()
