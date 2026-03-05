import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSkripsiResearchDomainsService extends BaseService {
  static async call() {
    return prisma.skripsi_research_domains.findMany({
      orderBy: { created_at: 'asc' }
    })
  }
}
