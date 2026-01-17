import { GetPublishedOsceTopicsService } from '#services/osce/user/getPublishedOsceTopicsService'
import OsceTopicSerializer from '#serializers/api/v1/osceTopicSerializer';

class TopicsController {
  // GET /api/v1/osce/topics - List published topics
  async index(req, res) {
      const topics = await GetPublishedOsceTopicsService.call()

      return res.status(200).json({
        data: OsceTopicSerializer.serializeList(topics),
      })
  }
}

export default new TopicsController();
