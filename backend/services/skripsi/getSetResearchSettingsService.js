import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSetResearchSettingsService extends BaseService {
  /**
   * Get research domain settings for a specific skripsi set.
   * Returns admin's available domains + the set's current selection.
   */
  static async call(setId) {
    const settings = await prisma.skripsi_set_settings.findUnique({
      where: { set_id: setId }
    })

    const allSelected = settings?.selected_domains ?? []
    const domainFilterEnabled = settings?.domain_filter_enabled ?? true

    const adminMatches = allSelected.length > 0
      ? await prisma.skripsi_research_domains.findMany({
          where: { domain: { in: allSelected } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    return {
      selectedDomains: allSelected.filter(d => adminSet.has(d)),
      customDomains: allSelected.filter(d => !adminSet.has(d)),
      domainFilterEnabled
    }
  }
}
