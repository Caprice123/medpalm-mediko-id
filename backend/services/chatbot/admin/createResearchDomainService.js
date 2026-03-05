import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateResearchDomainService extends BaseService {
  static async call({ domain }) {
    if (!domain || typeof domain !== 'string' || !domain.trim()) {
      throw new ValidationError('Domain is required')
    }

    const normalized = domain.trim().toLowerCase()

    const existing = await prisma.chatbot_research_domains.findUnique({
      where: { domain: normalized }
    })

    if (existing) {
      throw new ValidationError('Domain already exists')
    }

    const created = await prisma.chatbot_research_domains.create({
      data: { domain: normalized }
    })

    return created
  }
}
