import { GetEventsV2Service } from '#services/event/v2/getEventsV2Service'
import { EventSerializer } from '#serializers/api/v1/eventSerializer'

/**
 * V2 of the user-facing event list. The response shape is deliberately the same
 * as V1's, so the V1 serializer is reused as-is (read, never modified) rather
 * than duplicated — only the filtering changed, not the payload.
 *
 * Unlike V1's index, this route is behind authentication: the public landing
 * page keeps using `/api/v1/events`, so there is no anonymous caller here and
 * no need for V1's public-field whitelist.
 */
class EventV2Controller {
  async index(req, res) {
    const { page, perPage, search, claimState } = req.query

    const result = await GetEventsV2Service.call({
      page,
      perPage,
      search,
      claimState,
      userId: req.user.id,
    })

    return res.status(200).json({
      data: EventSerializer.serializeList(result.data),
      pagination: result.pagination,
    })
  }
}

export default new EventV2Controller()
