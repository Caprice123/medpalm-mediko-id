import { GetAtlasQuizAtlasModelsService } from '#services/atlasQuiz/atlas/getAtlasQuizAtlasModelsService'
import { GetAtlasQuizAtlasModelDetailService } from '#services/atlasQuiz/atlas/getAtlasQuizAtlasModelDetailService'

class AtlasModelsController {
  async index(req, res) {
    const { module, page, perPage } = req.query
    const data = await GetAtlasQuizAtlasModelsService.call({ slug: req.params.slug, module, page, perPage })
    return res.status(200).json(data)
  }

  async show(req, res) {
    const data = await GetAtlasQuizAtlasModelDetailService.call({ slug: req.params.slug, uniqueId: req.params.uniqueId })
    return res.status(200).json({ data })
  }
}

export default new AtlasModelsController()
