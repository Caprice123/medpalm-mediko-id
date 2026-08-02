import { GetAtlasQuizAnatomyQuizzesService } from '#services/atlasQuiz/anatomyQuiz/getAtlasQuizAnatomyQuizzesService'
import { GetAtlasQuizAnatomyQuizDetailService } from '#services/atlasQuiz/anatomyQuiz/getAtlasQuizAnatomyQuizDetailService'

class AnatomyQuizzesController {
  async index(req, res) {
    const { module, page, perPage } = req.query
    const data = await GetAtlasQuizAnatomyQuizzesService.call({ slug: req.params.slug, module, page, perPage })
    return res.status(200).json(data)
  }

  async show(req, res) {
    const data = await GetAtlasQuizAnatomyQuizDetailService.call({
      slug: req.params.slug,
      uniqueId: req.params.uniqueId,
      userRole: req.user?.role,
    })
    return res.status(200).json({ data })
  }
}

export default new AnatomyQuizzesController()
