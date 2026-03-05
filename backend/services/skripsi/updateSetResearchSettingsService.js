import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSetResearchSettingsService extends BaseService {
  static async call(setId, userId, { selectedDomains, domainFilterEnabled }) {
    const set = await prisma.skripsi_sets.findFirst({
      where: { id: setId, user_id: userId, is_deleted: false }
    })
    if (!set) throw new ValidationError('Set not found')

    const domains = Array.isArray(selectedDomains) ? selectedDomains : []

    const updated = await prisma.skripsi_sets.update({
      where: { id: setId },
      data: {
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        updated_at: new Date()
      }
    })

    return {
      selectedDomains: updated.selected_domains ?? [],
      domainFilterEnabled: updated.domain_filter_enabled
    }
  }
}
