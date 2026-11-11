import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { NotFoundError } from '#errors/notFoundError'
import { ValidationError } from '#errors/validationError'

const MAX_LIMIT = 100

// This exists rather than reusing GetTabMessagesService because that service
// serializes its own result through the V1 serializer, which drops `status` —
// so a V2 caller could never tell a truncated answer from a finished one. This
// returns the rows and lets the V2 serializer shape them.
//
// It also fixes V1's `hasMore`, which read `messages.length === limit`: a
// thread whose remaining messages happen to equal the page size reported more
// to come, and the reader kept offering to load older messages that were not
// there. Taking one extra row and reporting on that is exact.
export class GetTabMessagesV2Service extends BaseService {
  static async call({ tabId, userId, limit = 50, beforeMessageId = null }) {
    this.validate({ tabId, userId, limit })

    // Ownership lives on the set, so it is checked through the relation.
    const tab = await prisma.skripsi_tabs.findFirst({
      where: {
        id: tabId,
        skripsi_set: { user_id: userId, is_deleted: false },
      },
      select: { id: true },
    })

    if (!tab) {
      throw new NotFoundError('Tab tidak ditemukan')
    }

    const where = { tab_id: tabId }
    // Keyset pagination, not offset: new messages arrive while the thread is
    // open, so an offset would skip or repeat rows as the tail grows.
    if (beforeMessageId) {
      where.id = { lt: beforeMessageId }
    }

    const rows = await prisma.skripsi_messages.findMany({
      where,
      orderBy: { id: 'desc' },
      take: limit + 1,
      include: { skripsi_message_sources: { orderBy: { score: 'desc' } } },
    })

    const hasMore = rows.length > limit

    return {
      // Newest-first from the query, reversed so the reader runs oldest to newest.
      messages: rows.slice(0, limit).reverse(),
      hasMore,
    }
  }

  static validate({ tabId, userId, limit }) {
    if (!tabId || isNaN(parseInt(tabId))) {
      throw new ValidationError('ID tab tidak valid')
    }

    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }

    if (limit && (isNaN(parseInt(limit)) || parseInt(limit) < 1 || parseInt(limit) > MAX_LIMIT)) {
      throw new ValidationError(`Nilai limit tidak valid. Harus antara 1 dan ${MAX_LIMIT}`)
    }
  }
}
