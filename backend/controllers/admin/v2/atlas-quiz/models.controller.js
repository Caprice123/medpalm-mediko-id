import { CreateAtlasModelV2Service } from '#services/atlas/v2/admin/createAtlasModelService'
import { GetAtlasModelDetailService } from '#services/atlas/admin/getAtlasModelDetailService'
import { UpdateAtlasModelService } from '#services/atlas/admin/updateAtlasModelService'
import { DeleteAtlasModelService } from '#services/atlas/admin/deleteAtlasModelService'
import { AtlasModelSerializer } from '#serializers/admin/v1/atlasModelSerializer'

class ModelsController {
  async create(req, res) {
    const { title, description, embedUrl, tags, status, editorContent, nodeId } = req.body

    const model = await CreateAtlasModelV2Service.call({
      nodeId,
      title,
      description,
      embedUrl,
      tags,
      status,
      editorContent,
      createdBy: req.user.id,
    })

    return res.status(201).json({ data: AtlasModelSerializer.serialize(model) })
  }

  async show(req, res) {
    const { uniqueId } = req.params
    const model = await GetAtlasModelDetailService.call(uniqueId)
    return res.status(200).json({ data: AtlasModelSerializer.serialize(model) })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, embedUrl, tags, status, editorContent } = req.body

    const updatedModel = await UpdateAtlasModelService.call({
      modelId: uniqueId,
      title,
      description,
      embedUrl,
      tags,
      status,
      editorContent,
    })

    return res.status(200).json({ data: AtlasModelSerializer.serialize(updatedModel) })
  }

  async destroy(req, res) {
    const { uniqueId } = req.params
    await DeleteAtlasModelService.call(uniqueId)
    return res.status(200).json({ data: { success: true } })
  }
}

export default new ModelsController()
