import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { OpenAlexService } from '#services/ai/openAlex.service'

export class CreateSkripsiJournalNameService extends BaseService {
  static async call({ name }) {
    if (!name?.trim()) throw new ValidationError('Journal name is required')
    const normalized = name.trim()
    const existing = await prisma.skripsi_journal_names.findUnique({ where: { name: normalized } })
    if (existing) throw new ValidationError('Journal name already exists')
    const created = await prisma.skripsi_journal_names.create({ data: { name: normalized } })

    const resolution = await OpenAlexService.previewJournalResolution(normalized).catch(() => null)
    return { ...created, resolution }
  }
}
