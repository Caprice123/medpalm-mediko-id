import { GetUnlinkedAtlasModelsService } from '#services/atlas/v2/admin/getUnlinkedAtlasModelsService'
import { UpdateAtlasModelService } from '#services/atlas/admin/updateAtlasModelService'
import { DeleteAtlasModelService } from '#services/atlas/admin/deleteAtlasModelService'
import { AssignAtlasToNodeService } from '#services/atlas/v2/admin/assignAtlasToNodeService'
import { AtlasModelListSerializer } from '#serializers/admin/v2/atlasModelListSerializer'

class AtlasModelsController {
  async getUnlinked(req, res) {
    const { page = 1, perPage = 20, search = '' } = req.query
    const result = await GetUnlinkedAtlasModelsService.call({ page, perPage, search })
    return res.status(200).json({
      data: AtlasModelListSerializer.serialize(result.data),
      pagination: result.pagination,
    })
  }

  async updateUnlinked(req, res) {
    const { uniqueId } = req.params
    const { title, description, embedUrl, tags, status, editorContent } = req.body
    const model = await UpdateAtlasModelService.call({ modelId: uniqueId, title, description, embedUrl, tags, status, editorContent })
    const [serialized] = AtlasModelListSerializer.serialize([model])
    return res.status(200).json({ data: serialized })
  }

  async deleteUnlinked(req, res) {
    const { uniqueId } = req.params
    await DeleteAtlasModelService.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }

  async assignToNode(req, res) {
    const { uniqueId } = req.params
    const { nodeId } = req.body
    await AssignAtlasToNodeService.call({ uniqueId, nodeId })
    return res.status(200).json({ data: { success: true } })
  }
}

export default new AtlasModelsController()
