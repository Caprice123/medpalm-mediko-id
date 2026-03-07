import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSkripsiResearchDomainsService extends BaseService {
  static async call({ page = 1, perPage = 12, search = '' } = {}) {
    const where = search ? { domain: { contains: search, mode: 'insensitive' } } : {}

    const rows = await prisma.skripsi_research_domains.findMany({
      where,
      orderBy: { domain: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage + 1
    })

    const isLastPage = rows.length <= perPage
    const domains = rows.slice(0, perPage)

    return { domains, pagination: { page, perPage, isLastPage } }
  }
}
