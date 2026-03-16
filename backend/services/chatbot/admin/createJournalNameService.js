import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class CreateJournalNameService extends BaseService {
  static async call({ name }) {
    if (!name?.trim()) throw new ValidationError('Journal name is required')
    const normalized = name.trim()
    const existing = await prisma.chatbot_journal_names.findUnique({ where: { name: normalized } })
    if (existing) throw new ValidationError('Journal name already exists')
    return prisma.chatbot_journal_names.create({ data: { name: normalized } })
  }
}
