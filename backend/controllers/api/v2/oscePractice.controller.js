import { GetOscePerformanceV2Service } from '#services/osce/v2/getOscePerformanceV2Service'
import { GetOsceHubV2Service } from '#services/osce/v2/getOsceHubV2Service'
import { GetOsceStationsV2Service } from '#services/osce/v2/getOsceStationsV2Service'
import { GetOsceSessionHistoryV2Service } from '#services/osce/v2/getOsceSessionHistoryV2Service'
import { OscePerformanceSerializer } from '#serializers/api/v2/oscePerformanceSerializer'
import { OsceHubSerializer } from '#serializers/api/v2/osceHubSerializer'
import { OsceStationSerializer } from '#serializers/api/v2/osceStationSerializer'
import { OsceSessionHistorySerializer } from '#serializers/api/v2/osceSessionHistorySerializer'
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

  // GET /api/v2/osce-practice/hub
  async hub(req, res) {
    const hub = await GetOsceHubV2Service.call(req.user?.id)

    return res.status(200).json({ data: OsceHubSerializer.serialize(hub) })
  }

  // GET /api/v2/osce-practice/stations
  async stations(req, res) {
    const { search, topicTag, batchTag, page, perPage } = req.query
    const result = await GetOsceStationsV2Service.call(req.user?.id, {
      search, topicTag, batchTag, page, perPage,
    })

    return res.status(200).json({
      data: OsceStationSerializer.serializeList(result.stations),
      pagination: result.pagination,
    })
  }

  // GET /api/v2/osce-practice/sessions
  async sessions(req, res) {
    const { status, page, perPage } = req.query
    const result = await GetOsceSessionHistoryV2Service.call(req.user?.id, {
      status, page, perPage,
    })

    return res.status(200).json({
      data: OsceSessionHistorySerializer.serializeList(result.sessions),
      pagination: result.pagination,
    })
  }
}

export default new OscePracticeV2Controller()
