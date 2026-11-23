import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const MAX_PER_PAGE = 100

// The template picker on "Buat laporan baru": the admin-managed templates
// everyone sees, plus the student's own saved outlines. Inactive admin
// templates stay in the admin panel but are never offered here.
//
// Paged and searchable because an admin can publish any number of these, and
// each row drags its whole section list along for the card's summary line -
// so "just send them all" grows with the catalogue, in rows and in bytes.
export class GetSkripsiTemplatesV2Service extends BaseService {
  static async call({ userId, page = 1, perPage = 12, search } = {}) {
    this.validate({ page, perPage })

    const where = {
      is_active: true,
      OR: [{ owner_user_id: null }, { owner_user_id: userId ?? -1 }],
    }

    if (search?.trim()) {
      const term = search.trim()
      // AND, so the search narrows the ownership clause above rather than
      // replacing it - a bare second OR would offer another student's
      // templates to anyone who typed their name.
      where.AND = [{
        OR: [
          { name: { contains: term, mode: 'insensitive' } },
          { description: { contains: term, mode: 'insensitive' } },
        ],
      }]
    }

    const templates = await prisma.skripsi_templates.findMany({
      where,
      // Admin templates first, then the student's own, each in their own order.
      orderBy: [{ owner_user_id: { sort: 'asc', nulls: 'first' } }, { position: 'asc' }, { id: 'asc' }],
      include: {
        sections: { orderBy: [{ position: 'asc' }, { id: 'asc' }] },
      },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = templates.length <= perPage

    return {
      data: templates.slice(0, perPage),
      pagination: { page, perPage, isLastPage },
    }
  }

  // Checked against undefined rather than for truthiness: page 0 is falsy, and
  // waving it through means a negative `skip`, which Prisma rejects with a
  // stack trace instead of this message.
  static validate({ page, perPage }) {
    if (page !== undefined) {
      const pageNum = parseInt(page)
      if (isNaN(pageNum) || pageNum < 1) {
        throw new ValidationError('Nomor halaman tidak valid')
      }
    }

    if (perPage !== undefined) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > MAX_PER_PAGE) {
        throw new ValidationError(`Nilai perPage tidak valid. Harus antara 1 dan ${MAX_PER_PAGE}`)
      }
    }
  }
}
