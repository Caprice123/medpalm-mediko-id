import { GetMcqSubtopicsService } from '#services/mcq/v2/user/getMcqSubtopicsService'

class SubtopicsController {
  async getSubtopics(req, res) {
    const userId = req.user.id
    const { topicId } = req.params
    const cursor = req.query.cursor ? parseInt(req.query.cursor) : null
    const limit  = req.query.limit  ? parseInt(req.query.limit)  : 50
    const sortBy = req.query.sortBy === 'avgScore' ? 'avgScore' : 'name'
    const data = await GetMcqSubtopicsService.call({ userId, topicId, cursor, limit, sortBy })
    return res.status(200).json({ data })
  }
}

export default new SubtopicsController()
