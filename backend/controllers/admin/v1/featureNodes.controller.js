import { GetFeatureNodesService } from '#services/flashcard/v2-1/admin/getFeatureNodesService'
import { CreateFeatureNodeService } from '#services/flashcard/v2-1/admin/createFeatureNodeService'
import { UpdateFeatureNodeService } from '#services/flashcard/v2-1/admin/updateFeatureNodeService'
import { DeleteFeatureNodeService } from '#services/flashcard/v2-1/admin/deleteFeatureNodeService'
import { GetNodeCardsService } from '#services/flashcard/v2-1/admin/getNodeCardsService'
import { AddNodeCardService } from '#services/flashcard/v2-1/admin/addNodeCardService'
import { UpdateNodeCardService } from '#services/flashcard/v2-1/admin/updateNodeCardService'
import { DeleteNodeCardService } from '#services/flashcard/v2-1/admin/deleteNodeCardService'
import { MoveNodeCardService } from '#services/flashcard/v2-1/admin/moveNodeCardService'
import { FeatureNodesSerializer } from '#serializers/admin/v1/featureNodesSerializer'
import { NodeCardsSerializer } from '#serializers/admin/v1/nodeCardsSerializer'

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

  // Node cards (flashcard_cards linked via node_id)
  async getNodeCards(req, res) {
    const { nodeId } = req.params
    const { page = 1, perPage = 20 } = req.query
    const { cards, pagination } = await GetNodeCardsService.call({ nodeId, page, perPage })
    return res.status(200).json({ data: NodeCardsSerializer.serializeList(cards), pagination })
  }

  async addNodeCard(req, res) {
    const { nodeId } = req.params
    const { front, back, blobId } = req.body
    const card = await AddNodeCardService.call({ nodeId, front, back, blobId })
    return res.status(201).json({ data: NodeCardsSerializer.serialize(card) })
  }

  async updateNodeCard(req, res) {
    const { cardId } = req.params
    const { front, back, blobId } = req.body
    const card = await UpdateNodeCardService.call({ cardId, front, back, blobId })
    return res.status(200).json({ data: NodeCardsSerializer.serialize(card) })
  }

  async deleteNodeCard(req, res) {
    const { cardId } = req.params
    await DeleteNodeCardService.call({ cardId })
    return res.status(200).json({ data: { success: true } })
  }

  async moveNodeCard(req, res) {
    const { cardId } = req.params
    const { targetNodeId } = req.body
    await MoveNodeCardService.call({ cardId, targetNodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new FeatureNodesController()
