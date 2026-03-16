import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class DeleteJournalNameService extends BaseService {
  static async call({ id }) {
    const journal = await prisma.chatbot_journal_names.findUnique({ where: { id: parseInt(id) } })
    if (!journal) throw new ValidationError('Journal not found')
    await prisma.chatbot_journal_names.delete({ where: { id: parseInt(id) } })
    return { success: true }
  }
}
