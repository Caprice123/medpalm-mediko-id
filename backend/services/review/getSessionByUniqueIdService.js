import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import idriveService from '#services/idrive.service'

export class GetSessionByUniqueIdService extends BaseService {
  static async call({ userId, uniqueId }) {
    const session = await prisma.review_sessions.findUnique({
      where: { unique_id: uniqueId },
    })
    if (!session || session.user_id !== userId) {
      throw new ValidationError('Sesi tidak ditemukan')
    }

    const cardIds = session.card_ids ? JSON.parse(session.card_ids) : []
    if (cardIds.length === 0) return { session: { uniqueId }, cards: [] }

    const cards = await prisma.flashcard_cards.findMany({
      where: { id: { in: cardIds } },
    })

    const cardMap = new Map(cards.map(c => [c.id, c]))
    const ordered = cardIds.map(id => cardMap.get(id)).filter(Boolean)

    const attachments = await prisma.attachments.findMany({
      where: { record_type: 'flashcard_card', record_id: { in: cardIds }, name: 'image' },
      include: { blob: true },
    })

    const blobKeys = attachments.filter(a => a.blob).map(a => a.blob.key)
    const signedUrls = blobKeys.length > 0 ? await idriveService.getBulkSignedUrls(blobKeys, 3600) : []
    const urlMap = new Map(blobKeys.map((k, i) => [k, signedUrls[i]]))
    const attMap = new Map(attachments.map(a => [a.record_id, a]))

    const reviewStates = await prisma.user_review_states.findMany({
      where: { user_id: userId, record_type: session.record_type, record_id: { in: cardIds } },
    })
    const stateMap = new Map(reviewStates.map(s => [s.record_id, s]))

    const result = ordered.map(c => {
      const att = attMap.get(c.id)
      const imageUrl = att?.blob ? urlMap.get(att.blob.key) : null
      const state = stateMap.get(c.id)
      return {
        ...c,
        image_url: imageUrl,
        review_state: state ? {
          dueDate: state.due_date,
          interval: state.interval,
          reviewCount: state.review_count,
          lastRating: state.last_rating,
        } : null,
      }
    })

    return { session: { uniqueId }, cards: result }
  }
}
