import { GetPublicStatsV2Service } from '#services/home/v2/getPublicStatsV2Service'
import { GetLandingEventsV2Service } from '#services/home/v2/getLandingEventsV2Service'
import { serializeHomeStats } from '#serializers/api/v2/homeStatsSerializer'
import { serializeLandingEvents } from '#serializers/api/v2/landingEventsSerializer'

class HomeV2Controller {
  async stats(req, res) {
    const stats = await GetPublicStatsV2Service.call()
    return res.status(200).json({ data: serializeHomeStats(stats) })
  }

  async landingEvents(req, res) {
    const items = await GetLandingEventsV2Service.call({ limit: req.query.limit || 3 })
    return res.status(200).json({ data: serializeLandingEvents(items) })
  }
}

export default new HomeV2Controller()
