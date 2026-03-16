import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetChatbotJournalsService extends BaseService {
  static async call({ page = 1, perPage = 20, search = '' } = {}) {
    const where = {
      is_active: true,
      ...(search ? { name: { contains: search, mode: 'insensitive' } } : {})
    }
    const rows = await prisma.chatbot_journal_names.findMany({
      where,
      orderBy: { name: 'asc' },
      skip: (page - 1) * perPage,
      take: perPage + 1
    })
    const isLastPage = rows.length <= perPage
    return { journals: rows.slice(0, perPage), pagination: { page, perPage, isLastPage } }
  }
}
