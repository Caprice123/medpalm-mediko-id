import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'

export class UpdateSetResearchSettingsService extends BaseService {
  static async call(setId, userId, { selectedDomains, customDomains, domainFilterEnabled, selectedJournals, customJournals }) {
    const set = await prisma.skripsi_sets.findFirst({
      where: { id: setId, user_id: userId, is_deleted: false }
    })
    if (!set) throw new ValidationError('Set not found')

    const MAX_DOMAINS = 20
    const picked = Array.isArray(selectedDomains) ? selectedDomains : []
    const custom = Array.isArray(customDomains) ? customDomains : []
    const domains = [...new Set([...picked, ...custom])].slice(0, MAX_DOMAINS)

    const allJournals = [
      ...(Array.isArray(selectedJournals) ? selectedJournals : []),
      ...(Array.isArray(customJournals) ? customJournals : [])
    ]
    const journals = [...new Set(allJournals.map(j => j.trim()).filter(Boolean))]

    const settings = await prisma.skripsi_set_settings.upsert({
      where: { set_id: setId },
      create: {
        set_id: setId,
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        selected_journals: journals,
        updated_at: new Date()
      },
      update: {
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        selected_journals: journals,
        updated_at: new Date()
      }
    })

    // Split saved domains back into admin-list vs custom (same as GET)
    const allSaved = Array.isArray(settings.selected_domains) ? settings.selected_domains : []
    const adminMatches = allSaved.length > 0
      ? await prisma.skripsi_research_domains.findMany({
          where: { domain: { in: allSaved } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    const savedJournals = Array.isArray(settings.selected_journals) ? settings.selected_journals : []
    const adminJournalMatches = savedJournals.length > 0
      ? await prisma.$queryRaw`SELECT name FROM skripsi_journal_names WHERE name = ANY(${savedJournals})`
      : []
    const adminJournalSet = new Set(adminJournalMatches.map(r => r.name))

    return {
      selectedDomains: allSaved.filter(d => adminSet.has(d)),
      customDomains: allSaved.filter(d => !adminSet.has(d)),
      domainFilterEnabled: settings.domain_filter_enabled,
      selectedJournals: savedJournals.filter(j => adminJournalSet.has(j)),
      customJournals: savedJournals.filter(j => !adminJournalSet.has(j))
    }
  }
}
