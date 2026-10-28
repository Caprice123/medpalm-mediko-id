import { GetPublicStatsV2Service } from '#services/home/v2/getPublicStatsV2Service'
import { serializeHomeStats } from '#serializers/api/v2/homeStatsSerializer'

class HomeV2Controller {
  async stats(req, res) {
    const stats = await GetPublicStatsV2Service.call()
    return res.status(200).json({ data: serializeHomeStats(stats) })
  }
}

export default new HomeV2Controller()
