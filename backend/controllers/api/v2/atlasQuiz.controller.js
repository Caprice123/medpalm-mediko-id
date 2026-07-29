import { GetAtlasQuizTopicsService } from '#services/atlasQuiz/getAtlasQuizTopicsService'
import { GetAtlasQuizTopicDetailService } from '#services/atlasQuiz/getAtlasQuizTopicDetailService'
import { GetAtlasQuizAtlasModelsService } from '#services/atlasQuiz/atlas/getAtlasQuizAtlasModelsService'
import { GetAtlasQuizModuleOptionsService } from '#services/atlasQuiz/getAtlasQuizModuleOptionsService'
import { GetAtlasQuizAnatomyQuizzesService } from '#services/atlasQuiz/anatomyQuiz/getAtlasQuizAnatomyQuizzesService'
import { GetAtlasQuizAnatomyQuizDetailService } from '#services/atlasQuiz/anatomyQuiz/getAtlasQuizAnatomyQuizDetailService'
import { GetAtlasQuizAtlasModelDetailService } from '#services/atlasQuiz/atlas/getAtlasQuizAtlasModelDetailService'

class AtlasQuizV2Controller {
  async topics(req, res) {
    const { classification, page, perPage } = req.query
    const data = await GetAtlasQuizTopicsService.call({ classification, page, perPage })
    return res.status(200).json(data)
  }

  async topicDetail(req, res) {
    const data = await GetAtlasQuizTopicDetailService.call({ slug: req.params.slug })
    return res.status(200).json({ data })
  }

  async topicAtlasModels(req, res) {
    const { module, page, perPage } = req.query
    const data = await GetAtlasQuizAtlasModelsService.call({ slug: req.params.slug, module, page, perPage })
    return res.status(200).json(data)
  }

  async topicModuleOptions(req, res) {
    const data = await GetAtlasQuizModuleOptionsService.call({ slug: req.params.slug })
    return res.status(200).json({ data })
  }

  async topicAnatomyQuizzes(req, res) {
    const { module, page, perPage } = req.query
    const data = await GetAtlasQuizAnatomyQuizzesService.call({ slug: req.params.slug, module, page, perPage })
    return res.status(200).json(data)
  }

  async atlasModelDetail(req, res) {
    const data = await GetAtlasQuizAtlasModelDetailService.call({ slug: req.params.slug, uniqueId: req.params.uniqueId })
    return res.status(200).json({ data })
  }

  async anatomyQuizDetail(req, res) {
    const data = await GetAtlasQuizAnatomyQuizDetailService.call({
      slug: req.params.slug,
      uniqueId: req.params.uniqueId,
      userRole: req.user?.role,
    })
    return res.status(200).json({ data })
  }
}

export default new AtlasQuizV2Controller()
