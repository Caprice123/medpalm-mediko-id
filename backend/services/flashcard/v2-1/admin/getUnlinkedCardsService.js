import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUnlinkedCardsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' }) {
    const skip = (parseInt(page) - 1) * parseInt(perPage)
    const take = parseInt(perPage) + 1

    const searchFilter = search?.trim()
      ? Prisma.sql`AND (fc.front ILIKE ${`%${search.trim()}%`} OR fc.back ILIKE ${`%${search.trim()}%`})`
      : Prisma.empty

    const rawCards = await prisma.$queryRaw`
      SELECT fc.id, fc.front, fc.back, fc.is_deleted, fc.created_at, fc.updated_at
      FROM flashcard_cards fc
      LEFT JOIN feature_node_records fnr
        ON fnr.record_type = 'flashcard_card' AND fnr.record_id = fc.id
      WHERE fnr.id IS NULL
        AND fc.is_deleted = false
        ${searchFilter}
      ORDER BY fc.id DESC
      LIMIT ${take} OFFSET ${skip}
    `

    const isLastPage = rawCards.length <= parseInt(perPage)
    const cards = rawCards.slice(0, parseInt(perPage))
    const pagination = { page: parseInt(page), perPage: parseInt(perPage), isLastPage }

    return { cards, pagination }
  }
}
