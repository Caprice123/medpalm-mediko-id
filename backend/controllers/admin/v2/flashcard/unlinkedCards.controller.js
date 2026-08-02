import { GetUnlinkedCardsService } from '#services/flashcard/v2-1/admin/getUnlinkedCardsService'
import { UpdateNodeCardService } from '#services/flashcard/v2-1/admin/updateNodeCardService'
import { DeleteNodeCardService } from '#services/flashcard/v2-1/admin/deleteNodeCardService'
import { AssignCardToNodeService } from '#services/flashcard/v2-1/admin/assignCardToNodeService'
import { NodeCardsSerializer } from '#serializers/admin/v1/nodeCardsSerializer'

class UnlinkedCardsController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const { cards, pagination } = await GetUnlinkedCardsService.call({ page, perPage, search })
    return res.status(200).json({ data: NodeCardsSerializer.serializeList(cards), pagination })
  }

  async updateUnlinked(req, res) {
    const { cardId } = req.params
    const { front, back, blobId } = req.body
    const card = await UpdateNodeCardService.call({ cardId, front, back, blobId })
    return res.status(200).json({ data: NodeCardsSerializer.serialize(card) })
  }

  async deleteUnlinked(req, res) {
    const { cardId } = req.params
    await DeleteNodeCardService.call({ cardId })
    return res.status(200).json({ data: { success: true } })
  }

  async assignToNode(req, res) {
    const { cardId } = req.params
    const { nodeId } = req.body
    await AssignCardToNodeService.call({ cardId, nodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new UnlinkedCardsController()
