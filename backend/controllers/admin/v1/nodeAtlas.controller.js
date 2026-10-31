import { GetNodeAtlasModelsService } from '#services/atlas/v2/admin/getNodeAtlasModelsService'
import { UnlinkNodeAtlasModelService } from '#services/atlas/v2/admin/unlinkNodeAtlasModelService'
import { MoveNodeAtlasModelService } from '#services/atlas/v2/admin/moveNodeAtlasModelService'
import { SwapNodeAtlasModelOrderService } from '#services/atlas/v2/admin/swapNodeAtlasModelOrderService'
// v2 serializer: this list feeds the V2 module detail page, which needs `version` and
// `editorContent`. The v1 serializer emits neither — its tag fields are what the v1
// admin panel needs and this page never reads. Serving v1 here left the edit modal
// initialising editorContent to null, so saving a title change wiped the stored content.
import { AtlasModelListSerializer } from '#serializers/admin/v2/atlasModelListSerializer'

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
