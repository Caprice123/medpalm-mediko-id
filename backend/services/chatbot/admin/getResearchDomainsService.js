import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetResearchDomainsService extends BaseService {
  static async call() {
    const domains = await prisma.chatbot_research_domains.findMany({
      orderBy: { created_at: 'asc' }
    })

    return domains
  }
}
