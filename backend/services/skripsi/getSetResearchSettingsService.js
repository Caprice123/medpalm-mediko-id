import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSetResearchSettingsService extends BaseService {
  /**
   * Get research domain settings for a specific skripsi set.
   * Returns admin's available domains + the set's current selection.
   */
  static async call(setId) {
    const adminDomains = await prisma.skripsi_research_domains.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'asc' },
      select: { id: true, domain: true }
    })

    const set = await prisma.skripsi_sets.findUnique({
      where: { id: setId },
      select: { selected_domains: true, domain_filter_enabled: true }
    })

    return {
      selectedDomains: set?.selected_domains ?? [],
      domainFilterEnabled: set?.domain_filter_enabled ?? true,
      availableDomains: adminDomains
    }
  }
}
