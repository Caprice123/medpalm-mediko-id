import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetChatbotDomainsService extends BaseService {
  static async call({ page = 1, perPage = 12, search = '', onlyWithJournal = false } = {}) {
    const where = {
      is_active: true,
      ...(search ? { domain: { contains: search, mode: 'insensitive' } } : {}),
      ...(onlyWithJournal ? { journal_name: { not: '' } } : {})
    }

    const rows = await prisma.chatbot_research_domains.findMany({
      where,
      orderBy: { domain: 'asc' },
      select: { id: true, domain: true, journal_name: true },
      skip: (page - 1) * perPage,
      take: perPage + 1
    })

    const isLastPage = rows.length <= perPage
    const domains = rows.slice(0, perPage)

    return { domains, pagination: { page, perPage, isLastPage } }
  }
}
