import { GetAtlasModelsService } from '#services/atlas/getAtlasModelsService'
import { GetAtlasModelDetailService } from '#services/atlas/admin/getAtlasModelDetailService'
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
      perPage
    })

    return res.status(200).json({
      data: AtlasModelListSerializer.serialize(result.models),
      pagination: result.pagination
    })
  }

  async show(req, res) {
    const { uniqueId } = req.params

    const model = await GetAtlasModelDetailService.call(uniqueId)

    if (model.status !== 'published') {
      return res.status(403).json({ message: 'This atlas model is not available' })
    }

    return res.status(200).json({
      data: AtlasModelSerializer.serialize(model)
    })
  }
}

export default new AtlasController()
