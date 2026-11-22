import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

const MAX_PER_PAGE = 100

// Admin listing: inactive templates are included, since hiding one from
// students is exactly what the admin panel is for.
//
// Only what the table draws. The outline of each template is not sent — a page
// of twenty would carry every heading of every one of them to render a column
// that shows a number — so the row brings a section count and the edit form
// reads the template it is actually opening.
export class GetSkripsiTemplatesAdminV2Service extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' } = {}) {
    const safePerPage = Math.min(Math.max(parseInt(perPage) || 20, 1), MAX_PER_PAGE)
    const safePage = Math.max(parseInt(page) || 1, 1)

    const where = {}
    if (search?.trim()) {
      where.name = { contains: search.trim(), mode: 'insensitive' }
    }

    const templates = await prisma.skripsi_templates.findMany({
      where,
      orderBy: [{ position: 'asc' }, { id: 'asc' }],
      skip: (safePage - 1) * safePerPage,
      take: safePerPage + 1,
      include: { _count: { select: { sections: true } } },
    })

    const isLastPage = templates.length <= safePerPage

    return {
      data: templates.slice(0, safePerPage),
      pagination: { page: safePage, perPage: safePerPage, isLastPage },
    }
  }
}
