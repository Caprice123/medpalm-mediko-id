import { GetRecentlyViewedService } from '#services/recentlyViewed/getRecentlyViewedService'

class RecentlyViewedController {
  async index(req, res) {
    const { recordType, limit } = req.query
    const records = await GetRecentlyViewedService.call({
      userId: req.user.id,
      recordType,
      limit
    })
    return res.json({
      data: records.map(r => ({
        id: r.id,
        recordType: r.record_type,
        recordId: r.record_id,
        metadata: r.metadata,
        viewedAt: r.viewed_at
      }))
    })
  }
}

export default new RecentlyViewedController()
