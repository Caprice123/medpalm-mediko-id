import { GetPublishedOsceTopicsService } from '#services/osce/user/getPublishedOsceTopicsService'
import OsceTopicSerializer from '#serializers/api/v1/osceTopicSerializer';

class TopicsController {
  // GET /api/v1/osce/topics - List published topics
  async index(req, res) {
      const { search, topicTag, batchTag, page, perPage } = req.query

      const result = await GetPublishedOsceTopicsService.call({
        search,
        topicTag,
        batchTag,
        page,
        perPage
      })

      return res.status(200).json({
        data: OsceTopicSerializer.serializeList(result.topics),
        pagination: result.pagination
      })
  }
}

export default new TopicsController();
