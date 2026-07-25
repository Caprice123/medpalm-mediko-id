import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

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
      return { ...card, imageUrl: urlMap.get(card.id) || null, imageBlobId: blob?.id ?? null }
    })

    return { cards: enriched, pagination }
  }
}
