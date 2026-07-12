import { randomUUID } from 'crypto'
import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GetReviewSessionService } from './getReviewSessionService.js'

const SESSION_CAP = 100

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Most overdue first; new cards (no review state) go last
function sortByDueDate(cards) {
  return [...cards].sort((a, b) => {
    const aDate = a.review_state?.dueDate
    const bDate = b.review_state?.dueDate
    if (!aDate && !bDate) return 0
    if (!aDate) return 1
    if (!bDate) return -1
    return new Date(aDate) - new Date(bDate)
  })
}

export class StartReviewSessionService extends BaseService {
  static async call({ userId, type = 'all', recordType = 'flashcard_card', mode = 'due_today', nodeIds, departmentNodeIds, lastRating, cardLimit }) {
    const cards = await GetReviewSessionService.call({
      userId,
      recordType,
      mode,
      nodeIds,
      departmentNodeIds,
      lastRating,
    })

    const limit = parseInt(cardLimit) || SESSION_CAP
    // Prioritise most overdue, then shuffle within that capped set for variety
    const prioritised = sortByDueDate(cards).slice(0, limit)
    const shuffled = shuffle(prioritised)
    const uniqueId = randomUUID()

    await prisma.review_sessions.create({
      data: {
        unique_id: uniqueId,
        user_id: userId,
        type,
        record_type: recordType,
        mode,
        node_ids: nodeIds || null,
        department_node_ids: departmentNodeIds || null,
        last_rating: lastRating || null,
        card_limit: limit,
        card_ids: JSON.stringify(shuffled.map(c => c.id)),
      },
    })

    return { uniqueId, cards: shuffled }
  }
}
