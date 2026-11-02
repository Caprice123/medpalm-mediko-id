import { GetOscePerformanceV2Service } from '#services/osce/v2/getOscePerformanceV2Service'
import { OscePerformanceSerializer } from '#serializers/api/v2/oscePerformanceSerializer'
import { shouldCalculateOscePerformanceStats } from '#utils/oscePerformanceStats'

class OscePracticeV2Controller {
  // GET /api/v2/osce-practice/performance
  async performance(req, res) {
    const userId = req.user?.id
    // Read from the counters only where they are actually being maintained; everywhere else
    // the numbers are derived from the sessions, so the chart never shows a half-filled table.
    const performance = await GetOscePerformanceV2Service.call(userId, {
      useStatistics: shouldCalculateOscePerformanceStats(req),
    })

    return res.status(200).json({ data: OscePerformanceSerializer.serialize(performance) })
  }
}

export default new OscePracticeV2Controller()
