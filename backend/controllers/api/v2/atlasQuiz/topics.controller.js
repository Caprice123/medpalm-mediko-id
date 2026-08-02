import { GetAtlasQuizTopicsService } from '#services/atlasQuiz/getAtlasQuizTopicsService'
import { GetAtlasQuizTopicDetailService } from '#services/atlasQuiz/getAtlasQuizTopicDetailService'
import { GetAtlasQuizModuleOptionsService } from '#services/atlasQuiz/getAtlasQuizModuleOptionsService'

class TopicsController {
  async index(req, res) {
    const { classification, page, perPage } = req.query
    const data = await GetAtlasQuizTopicsService.call({ classification, page, perPage })
    return res.status(200).json(data)
  }

  async show(req, res) {
    const data = await GetAtlasQuizTopicDetailService.call({ slug: req.params.slug })
    return res.status(200).json({ data })
  }

  async moduleOptions(req, res) {
    const data = await GetAtlasQuizModuleOptionsService.call({ slug: req.params.slug })
    return res.status(200).json({ data })
  }
}

export default new TopicsController()
