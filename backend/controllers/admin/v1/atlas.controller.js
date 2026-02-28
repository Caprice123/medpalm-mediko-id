import { CreateAtlasModelService } from '#services/atlas/admin/createAtlasModelService'
import { GetAtlasModelsService } from '#services/atlas/admin/getAtlasModelsService'
import { GetAtlasModelDetailService } from '#services/atlas/admin/getAtlasModelDetailService'
import { UpdateAtlasModelService } from '#services/atlas/admin/updateAtlasModelService'
import { DeleteAtlasModelService } from '#services/atlas/admin/deleteAtlasModelService'
import { AtlasModelSerializer } from '#serializers/admin/v1/atlasModelSerializer'
import { AtlasModelListSerializer } from '#serializers/admin/v1/atlasModelListSerializer'

class AtlasController {
  async index(req, res) {
    const { topic, subtopic, status, page, perPage, search } = req.query

    const result = await GetAtlasModelsService.call({
      topic,
      subtopic,
      status,
      page,
      perPage,
      search
    })

    return res.status(200).json({
      data: AtlasModelListSerializer.serialize(result.data),
      pagination: result.pagination
    })
  }

  async create(req, res) {
    const { title, description, embedUrl, tags, status } = req.body

    const model = await CreateAtlasModelService.call({
      title,
      description,
      embedUrl,
      tags,
      status: status || 'draft',
      createdBy: req.user.id
    })

    return res.status(201).json({
      data: AtlasModelSerializer.serialize(model)
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const model = await GetAtlasModelDetailService.call(uniqueId)

    return res.status(200).json({
      data: AtlasModelSerializer.serialize(model)
    })
  }

  async update(req, res) {
    const { uniqueId } = req.params
    const { title, description, embedUrl, tags, status } = req.body

    const updatedModel = await UpdateAtlasModelService.call({
      modelId: uniqueId,
      title,
      description,
      embedUrl,
      tags,
      status
    })

    return res.status(200).json({
      data: AtlasModelSerializer.serialize(updatedModel)
    })
  }

  async delete(req, res) {
    const { uniqueId } = req.params

    await DeleteAtlasModelService.call(uniqueId)

    return res.status(200).json({
      data: { success: true }
    })
  }
}

export default new AtlasController()
