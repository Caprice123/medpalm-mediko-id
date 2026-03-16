import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateResearchDomainService extends BaseService {
  static async call({ domain, journal_name }) {
    if (!domain || typeof domain !== 'string' || !domain.trim()) {
      throw new ValidationError('Domain is required')
    }
    if (!journal_name || typeof journal_name !== 'string' || !journal_name.trim()) {
      throw new ValidationError('Journal name is required')
    }

    const normalized = domain.trim().toLowerCase()

    const existing = await prisma.chatbot_research_domains.findUnique({
      where: { domain: normalized }
    })

    if (existing) {
      throw new ValidationError('Domain already exists')
    }

    const created = await prisma.chatbot_research_domains.create({
      data: { domain: normalized, journal_name: journal_name?.trim() || '' }
    })

    return created
  }
}
