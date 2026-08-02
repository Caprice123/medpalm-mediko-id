import { GetNodeBatchStatsService } from '#services/featureNodes/user/getNodeBatchStatsService'
import { GetNodeStatsService } from '#services/featureNodes/user/getNodeStatsService'

class StatsController {
  async batchStats(req, res) {
    const { nodeIds, type } = req.query
    const data = await GetNodeBatchStatsService.call({ nodeIds, type })
    return res.json({ data })
  }

  async stats(req, res) {
    const { id } = req.params
    const data = await GetNodeStatsService.call({ nodeId: id })
    return res.json({ data })
  }
}

export default new StatsController()
