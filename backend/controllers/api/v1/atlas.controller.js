import { GetAtlasModelsService } from '#services/atlas/getAtlasModelsService'
import { GetAtlasModelDetailService } from '#services/atlas/getAtlasModelDetailService'
import { AtlasModelListSerializer } from '#serializers/api/v1/atlasModelListSerializer'
import { AtlasModelSerializer } from '#serializers/api/v1/atlasModelSerializer'

class AtlasController {
  async index(req, res) {
    const { topic, subtopic, search, page, perPage } = req.query

    const result = await GetAtlasModelsService.call({
      topic,
      subtopic,
      search,
      page,
      perPage,
      userRole: req.user.role
    })

    return res.status(200).json({
      data: AtlasModelListSerializer.serialize(result.models),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const model = await GetAtlasModelDetailService.call(uniqueId, { userId: req.user.id, userRole: req.user.role })

    return res.status(200).json({
      data: AtlasModelSerializer.serialize(model)
    })
  }
}

export default new AtlasController()
