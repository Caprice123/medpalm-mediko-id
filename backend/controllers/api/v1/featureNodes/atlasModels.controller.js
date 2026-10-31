import { GetNodeAtlasModelsService } from '#services/atlas/v2/user/getNodeAtlasModelsService'
import { GetTopicAtlasModelsService } from '#services/atlas/v2/user/getTopicAtlasModelsService'

class AtlasModelsController {
  async nodeAtlasModels(req, res) {
    const data = await GetNodeAtlasModelsService.call({ nodeId: req.params.id })
    return res.json({ data })
  }

  async topicAtlasModels(req, res) {
    const data = await GetTopicAtlasModelsService.call({ topicId: req.params.id })
    return res.json({ data })
  }
}

export default new AtlasModelsController()
