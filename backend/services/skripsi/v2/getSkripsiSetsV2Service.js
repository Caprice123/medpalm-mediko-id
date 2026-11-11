import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

const MAX_PER_PAGE = 100

// This exists rather than reusing GetSkripsiSetsService because that one takes
// no `search` argument at all — while the V1 list page ships a "Cari set
// berdasarkan nama" box whose submit handler refetches with nothing attached,
// so typing in it has never filtered anything. The schema even carries a GIN
// trigram index for this (`skripsi_sets_search_gin_idx` over title and
// description), built for a search that was never wired up; `contains` with
// `mode: 'insensitive'` is what that index is there to serve.
export class GetSkripsiSetsV2Service extends BaseService {
  static async call({ userId, page = 1, perPage = 20, search }) {
    this.validate({ userId, page, perPage })

    const where = { user_id: userId, is_deleted: false }

    if (search?.trim()) {
      const term = search.trim()
      where.OR = [
        { title: { contains: term, mode: 'insensitive' } },
        { description: { contains: term, mode: 'insensitive' } },
      ]
    }

    const sets = await prisma.skripsi_sets.findMany({
      where,
      orderBy: { updated_at: 'desc' },
      skip: (page - 1) * perPage,
      take: perPage + 1,
    })

    const isLastPage = sets.length <= perPage

    return {
      data: sets.slice(0, perPage),
      pagination: { page, perPage, isLastPage },
    }
  }

  static validate({ userId, page, perPage }) {
    if (!userId || isNaN(parseInt(userId))) {
      throw new ValidationError('ID pengguna tidak valid')
    }

    if (page && (isNaN(parseInt(page)) || parseInt(page) < 1)) {
      throw new ValidationError('Nomor halaman tidak valid')
    }

    if (perPage) {
      const perPageNum = parseInt(perPage)
      if (isNaN(perPageNum) || perPageNum < 1 || perPageNum > MAX_PER_PAGE) {
        throw new ValidationError(`Nilai perPage tidak valid. Harus antara 1 dan ${MAX_PER_PAGE}`)
      }
    }
  }
}
