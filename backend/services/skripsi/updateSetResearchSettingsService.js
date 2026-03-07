import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSetResearchSettingsService extends BaseService {
  static async call(setId, userId, { selectedDomains, customDomains, domainFilterEnabled }) {
    const set = await prisma.skripsi_sets.findFirst({
      where: { id: setId, user_id: userId, is_deleted: false }
    })
    if (!set) throw new ValidationError('Set not found')

    const MAX_DOMAINS = 20
    const picked = Array.isArray(selectedDomains) ? selectedDomains : []
    const custom = Array.isArray(customDomains) ? customDomains : []
    const domains = [...new Set([...picked, ...custom])].slice(0, MAX_DOMAINS)

    const settings = await prisma.skripsi_set_settings.upsert({
      where: { set_id: setId },
      create: {
        set_id: setId,
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        updated_at: new Date()
      },
      update: {
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        updated_at: new Date()
      }
    })

    // Split saved domains back into admin-list vs custom (same as GET)
    const allSaved = settings.selected_domains ?? []
    const adminMatches = allSaved.length > 0
      ? await prisma.skripsi_research_domains.findMany({
          where: { domain: { in: allSaved } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    return {
      selectedDomains: allSaved.filter(d => adminSet.has(d)),
      customDomains: allSaved.filter(d => !adminSet.has(d)),
      domainFilterEnabled: settings.domain_filter_enabled
    }
  }
}
