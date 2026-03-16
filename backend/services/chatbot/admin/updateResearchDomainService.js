import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateResearchDomainService extends BaseService {
  static async call({ id, is_active, journal_name }) {
    const domain = await prisma.chatbot_research_domains.findUnique({
      where: { id: parseInt(id) }
    })

    if (!domain) {
      throw new ValidationError('Domain not found')
    }

    const data = { updated_at: new Date() }
    if (is_active !== undefined) data.is_active = is_active
    if (journal_name !== undefined) {
      if (!journal_name.trim()) throw new ValidationError('Journal name is required')
      data.journal_name = journal_name.trim()
    }

    const updated = await prisma.chatbot_research_domains.update({
      where: { id: parseInt(id) },
      data
    })

    return updated
  }
}
