import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteSkripsiResearchDomainService extends BaseService {
  static async call({ id }) {
    const domain = await prisma.skripsi_research_domains.findUnique({ where: { id: parseInt(id) } })
    if (!domain) throw new ValidationError('Domain not found')
    await prisma.skripsi_research_domains.delete({ where: { id: parseInt(id) } })
  }
}
