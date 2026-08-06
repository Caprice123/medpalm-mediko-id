import { GetNodeAtlasModelsService } from '#services/featureNodes/admin/getNodeAtlasModelsService'
import { UnlinkNodeAtlasModelService } from '#services/featureNodes/admin/unlinkNodeAtlasModelService'
import { MoveNodeAtlasModelService } from '#services/featureNodes/admin/moveNodeAtlasModelService'
import { SwapNodeAtlasModelOrderService } from '#services/featureNodes/admin/swapNodeAtlasModelOrderService'
import { AtlasModelListSerializer } from '#serializers/admin/v1/atlasModelListSerializer'

class NodeAtlasController {
  async index(req, res) {
    const { nodeId } = req.params
    const { page, perPage } = req.query
    const result = await GetNodeAtlasModelsService.call({ nodeId, page, perPage })
    return res.status(200).json({
      data: AtlasModelListSerializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  async destroy(req, res) {
    const { nodeId, modelId } = req.params
    await UnlinkNodeAtlasModelService.call({ nodeId, modelId })
    return res.status(200).json({ data: { success: true } })
  }

  async move(req, res) {
    const { nodeId, modelId } = req.params
    const { targetNodeId } = req.body
    await MoveNodeAtlasModelService.call({ nodeId, modelId, targetNodeId })
    return res.status(200).json({ data: { success: true } })
  }

  async swapOrder(req, res) {
    const { nodeId, modelId } = req.params
    const { withModelId } = req.body
    await SwapNodeAtlasModelOrderService.call({ nodeId, modelId, withModelId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new NodeAtlasController()
