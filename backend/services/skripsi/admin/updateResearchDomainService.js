import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSkripsiResearchDomainService extends BaseService {
  static async call({ id, is_active }) {
    const domain = await prisma.skripsi_research_domains.findUnique({ where: { id: parseInt(id) } })
    if (!domain) throw new ValidationError('Domain not found')

    return prisma.skripsi_research_domains.update({
      where: { id: parseInt(id) },
      data: { is_active, updated_at: new Date() }
    })
  }
}
