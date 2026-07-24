import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import idriveService from '#services/idrive.service'

export class StartFlashcardNodeDueSessionService extends BaseService {
  static async call({ userId, nodeId, count }) {
    const node = await prisma.feature_nodes.findUnique({ where: { id: parseInt(nodeId) } })
    if (!node) throw new ValidationError('Sub-topik tidak ditemukan')

    const now = new Date()

    const allCardRefs = await prisma.flashcard_cards.findMany({
      where: { node_id: parseInt(nodeId) },
      select: { id: true },
    })

    if (allCardRefs.length === 0) return []

    const cardIds = allCardRefs.map(c => c.id)

    const reviewStates = await prisma.user_review_states.findMany({
      where: { user_id: userId, record_type: 'flashcard_card', record_id: { in: cardIds } },
      select: { record_id: true, due_date: true },
    })
    const stateMap = new Map(reviewStates.map(s => [s.record_id, s]))

    const dueIds = cardIds.filter(id => {
      const state = stateMap.get(id)
      return state && state.due_date <= now
    })

    if (dueIds.length === 0) return []

    const shuffled = [...dueIds].sort(() => Math.random() - 0.5)
    const limit = count ? Math.min(parseInt(count), shuffled.length) : shuffled.length
    const selectedIds = shuffled.slice(0, limit)

    const cards = await prisma.flashcard_cards.findMany({ where: { id: { in: selectedIds } } })

    const attachments = await prisma.attachments.findMany({
      where: { record_type: 'flashcard_card', record_id: { in: selectedIds }, name: 'image' },
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

    return cards.map(card => ({
      id: card.id,
      front: card.front,
      back: card.back,
      imageUrl: urlMap.get(card.id) || null,
    }))
  }
}
