import { Prisma } from '@prisma/client'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

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

    if (cards.length === 0) return { cards, pagination }

    const cardIds = cards.map(c => c.id)
    const attachments = await prisma.attachments.findMany({
      where: { record_type: 'flashcard_card', record_id: { in: cardIds }, name: 'image' },
    })

    const blobIds = attachments.map(a => a.blob_id)
    const blobs = blobIds.length > 0
      ? await prisma.blobs.findMany({ where: { id: { in: blobIds } } })
      : []

    const attachmentMap = new Map(attachments.map(a => [a.record_id, a]))
    const blobMap = new Map(blobs.map(b => [b.id, b]))

    const blobKeys = []
    const cardBlobKeyMap = new Map()
    cards.forEach(card => {
      const att = attachmentMap.get(card.id)
      if (att) {
        const blob = blobMap.get(att.blob_id)
        if (blob) { blobKeys.push(blob.key); cardBlobKeyMap.set(card.id, blob.key) }
      }
    })

    const presignedUrls = blobKeys.length > 0
      ? await idriveService.getBulkSignedUrls(blobKeys, 3600)
      : []

    const urlMap = new Map()
    let idx = 0
    cards.forEach(card => { if (cardBlobKeyMap.has(card.id)) urlMap.set(card.id, presignedUrls[idx++]) })

    const enriched = cards.map(card => {
      const att = attachmentMap.get(card.id)
      const blob = att ? blobMap.get(att.blob_id) : null
      return {
        ...card,
        imageUrl: urlMap.get(card.id) || null,
        imageBlobId: blob?.id ?? null,
      }
    })

    return { cards: enriched, pagination }
  }
}
