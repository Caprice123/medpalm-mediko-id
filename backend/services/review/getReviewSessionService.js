import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import idriveService from '#services/idrive.service'

export class GetReviewSessionService extends BaseService {
  static async call({ userId, recordType = 'flashcard_card', nodeId, nodeIds, departmentNodeId, departmentNodeIds, mode = 'due_today', limit, lastRating }) {
    // 1. Find published deck IDs linked to the node filter
    const nodeWhere = { record_type: 'flashcard_deck' }
    const parsedNodeIds = nodeIds
      ? String(nodeIds).split(',').map(Number).filter(Boolean)
      : nodeId ? [parseInt(nodeId)] : []
    const parsedDeptIds = departmentNodeIds
      ? String(departmentNodeIds).split(',').map(Number).filter(Boolean)
      : departmentNodeId ? [parseInt(departmentNodeId)] : []

    if (parsedNodeIds.length > 0) nodeWhere.node_id = { in: parsedNodeIds }
    else if (parsedDeptIds.length > 0) nodeWhere.node = { parent_id: { in: parsedDeptIds } }

    const nodeRecords = await prisma.feature_node_records.findMany({
      where: nodeWhere,
      select: { record_id: true },
    })
    const deckIds = nodeRecords.map(r => r.record_id)

    // 2. Get cards from those published decks
    const cardWhere = { flashcard_decks: { status: 'published', is_deleted: false } }
    if (deckIds.length > 0) cardWhere.deck_id = { in: deckIds }

    const allCards = await prisma.flashcard_cards.findMany({
      where: cardWhere,
      orderBy: { order: 'asc' },
    })

    const cardIds = allCards.map(c => c.id)

    // 3. Fetch review states for these cards
    const reviewStates = await prisma.user_review_states.findMany({
      where: { user_id: userId, record_type: recordType, record_id: { in: cardIds } },
    })
    const stateMap = new Map(reviewStates.map(s => [s.record_id, s]))

    // 4. Filter by mode
    const now = new Date()
    let filtered = allCards
    if (mode === 'due_today') {
      filtered = allCards.filter(c => {
        const s = stateMap.get(c.id)
        return s ? s.due_date <= now : true // treat new cards as due
      })
    } else if (mode === 'new_cards') {
      filtered = allCards.filter(c => !stateMap.has(c.id))
    } else if (mode === 'struggling') {
      filtered = allCards.filter(c => {
        const s = stateMap.get(c.id)
        return s && (s.last_rating === 'again' || s.last_rating === 'hard')
      })
    }

    // 4b. Filter by specific last rating(s) if provided (comma-separated)
    if (lastRating) {
      const ratings = String(lastRating).split(',').map(r => r.trim()).filter(Boolean)
      filtered = filtered.filter(c => {
        const s = stateMap.get(c.id)
        return s && ratings.includes(s.last_rating)
      })
    }

    // 5. Apply limit
    const cards = limit != null ? filtered.slice(0, parseInt(limit) || 20) : filtered

    // 6. Attach image URLs via attachments
    const ids = cards.map(c => c.id)
    const attachments = ids.length > 0
      ? await prisma.attachments.findMany({
          where: { record_type: 'flashcard_card', record_id: { in: ids }, name: 'image' },
          include: { blob: true },
        })
      : []

    const blobKeys = attachments.filter(a => a.blob).map(a => a.blob.key)
    const signedUrls = blobKeys.length > 0 ? await idriveService.getBulkSignedUrls(blobKeys, 3600) : []
    const urlMap = new Map(blobKeys.map((k, i) => [k, signedUrls[i]]))
    const attMap = new Map(attachments.map(a => [a.record_id, a]))

    return cards.map(c => {
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
  }
}
