import { GetMcqSubtopicsService } from '#services/mcq/v2/user/getMcqSubtopicsService'

class SubtopicsController {
  async getSubtopics(req, res) {
    const userId = req.user.id
    const { topicId } = req.params
    const subtopics = await GetMcqSubtopicsService.call({ userId, topicId })
    return res.status(200).json({ data: subtopics })
  }
}

export default new SubtopicsController()
