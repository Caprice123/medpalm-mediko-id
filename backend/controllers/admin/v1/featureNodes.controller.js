import { GetFeatureNodesService } from '#services/flashcard/v2-1/admin/getFeatureNodesService'
import { CreateFeatureNodeService } from '#services/flashcard/v2-1/admin/createFeatureNodeService'
import { UpdateFeatureNodeService } from '#services/flashcard/v2-1/admin/updateFeatureNodeService'
import { DeleteFeatureNodeService } from '#services/flashcard/v2-1/admin/deleteFeatureNodeService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'

class FeatureNodesController {
  async index(req, res) {
    const { search, nodeType, parentId, layer, visibility, classification } = req.query
    const nodes = await GetFeatureNodesService.call({
      search,
      nodeType,
      parentId: parentId === 'null' ? null : parentId,
      layer,
      visibility,
      classification,
    })
    return res.status(200).json({ data: FeatureNodesSerializer.serializeList(nodes) })
  }

  async create(req, res) {
    const { name, slug, parentId, nodeType, visibility, classification, layer } = req.body
    const node = await CreateFeatureNodeService.call({ name, slug, parentId, nodeType, visibility, classification, layer })
    return res.status(201).json({ data: FeatureNodesSerializer.serialize(node) })
  }

  async update(req, res) {
    const { id } = req.params
    const { name, slug, parentId, nodeType, visibility, classification, layer } = req.body
    const node = await UpdateFeatureNodeService.call({ id, name, slug, parentId, nodeType, visibility, classification, layer })
    return res.status(200).json({ data: FeatureNodesSerializer.serialize(node) })
  }

  async delete(req, res) {
    const { id } = req.params
    await DeleteFeatureNodeService.call({ id })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new FeatureNodesController()
