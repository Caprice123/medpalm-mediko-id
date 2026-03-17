import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSkripsiJournalNameService extends BaseService {
  static async call({ id, name, is_active }) {
    const journal = await prisma.skripsi_journal_names.findUnique({ where: { id: parseInt(id) } })
    if (!journal) throw new ValidationError('Journal not found')
    const data = { updated_at: new Date() }
    if (name !== undefined) {
      if (!name.trim()) throw new ValidationError('Journal name is required')
      data.name = name.trim()
    }
    if (is_active !== undefined) data.is_active = is_active
    return prisma.skripsi_journal_names.update({ where: { id: parseInt(id) }, data })
  }
}
