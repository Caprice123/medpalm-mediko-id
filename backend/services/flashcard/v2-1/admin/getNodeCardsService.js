import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetNodeCardsService extends BaseService {
  static async call({ nodeId, page = 1, perPage = 20 }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const records = await prisma.feature_node_records.findMany({
      where: { node_id: parseInt(nodeId), record_type: 'flashcard_card' },
      orderBy: { id: 'asc' },
      skip,
      take,
    })

    const isLastPage = records.length <= parseInt(perPage)
    const pageRecords = records.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    if (pageRecords.length === 0) return { cards: [], pagination }

    const cardIds = pageRecords.map(r => r.record_id)
    const rawCards = await prisma.flashcard_cards.findMany({ where: { id: { in: cardIds } } })
    const cardMap = new Map(rawCards.map(c => [c.id, c]))
    const cards = pageRecords.map(r => cardMap.get(r.record_id)).filter(Boolean)

    return { cards, pagination }
  }
}
