import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

// V2 admin conversation listing.
//
// This exists rather than reusing GetAdminConversationsService because that one
// transforms rows without carrying `unique_id` through, while every admin action
// (open, delete) addresses a conversation by its uniqueId — so the V1 list hands
// the panel `uniqueId: undefined`. V1 stays as it is; V2 keeps the identifier.
//
// Search also widens here: V1 matched the topic only, so an admin looking for
// "who asked this" could not search by the student's name or email.
export class GetAdminConversationsV2Service extends BaseService {
  static async call({ page = 1, perPage = 20, userId, search }) {
    this.validate({ page, perPage, userId })

    const where = { is_deleted: false }

    if (userId) {
      where.user_id = parseInt(userId)
    }

    if (search) {
      where.OR = [
        { topic: { contains: search, mode: 'insensitive' } },
        { users: { name: { contains: search, mode: 'insensitive' } } },
        { users: { email: { contains: search, mode: 'insensitive' } } },
      ]
    }

    const conversations = await prisma.chatbot_conversations.findMany({
      where,
      take: perPage + 1,
      skip: (page - 1) * perPage,
      include: {
        users: { select: { id: true, name: true, email: true } },
        _count: { select: { chatbot_messages: true } },
      },
      orderBy: { updated_at: 'desc' },
    })

    const isLastPage = conversations.length <= perPage

    return {
      data: conversations.slice(0, perPage),
      pagination: { page, perPage, isLastPage },
    }
  }

  static validate({ page, perPage, userId }) {
    if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
      throw new ValidationError('Nomor halaman tidak valid')
    }

    if (perPage) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > 100) {
        throw new ValidationError('Nilai perPage tidak valid. Harus antara 1 dan 100')
      }
    }

    if (userId && isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }
  }
}
