import { GetMcqTopicsService } from '#services/mcq/v2/user/getMcqTopicsService'

class TopicsController {
  async getTopics(req, res) {
    const userId = req.user.id
    const topics = await GetMcqTopicsService.call({ userId })
    return res.status(200).json({ data: topics })
  }
}

export default new TopicsController()
