import { GetStatisticsService } from '../../../services/statistic/getStatisticsService.js'
import { UpdateStatisticService } from '../../../services/statistic/updateStatisticService.js'

class StatisticController {
  /**
   * Get platform statistics
   * GET /api/v1/statistics
   */
  async index(req, res) {
    const statistics = await GetStatisticsService.call()

    return res.status(200).json({
      success: true,
      data: statistics
    })
  }

  /**
   * Initialize statistics from existing data
   * POST /api/v1/statistics/initialize
   */
  async initialize(req, res) {
    const statistics = await UpdateStatisticService.initialize()

    return res.status(200).json({
      success: true,
      message: 'Statistics initialized successfully',
      data: statistics
    })
  }
}

export default new StatisticController()
