import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetSetResearchSettingsService extends BaseService {
  /**
   * Get research domain settings for a specific skripsi set.
   * Returns admin's available domains + the set's current selection.
   * Also returns isTutor flag and selectedJournals for tutor users.
   */
  static async call(setId, userId = null) {
    const [settings, userRecord] = await Promise.all([
      prisma.skripsi_set_settings.findUnique({ where: { set_id: setId } }),
      userId ? prisma.users.findUnique({ where: { id: userId }, select: { role: true } }) : Promise.resolve(null)
    ])

    const isTutor = userRecord?.role === 'tutor'
    const domainFilterEnabled = settings?.domain_filter_enabled ?? true

    const allSelected = Array.isArray(settings?.selected_domains) ? settings.selected_domains : []
    const adminMatches = allSelected.length > 0
      ? await prisma.skripsi_research_domains.findMany({
          where: { domain: { in: allSelected } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    const allJournals = Array.isArray(settings?.selected_journals) ? settings.selected_journals : []
    const adminJournalMatches = allJournals.length > 0
      ? await prisma.$queryRaw`SELECT name FROM skripsi_journal_names WHERE name = ANY(${allJournals})`
      : []
    const adminJournalSet = new Set(adminJournalMatches.map(r => r.name))

    return {
      selectedDomains: allSelected.filter(d => adminSet.has(d)),
      customDomains: allSelected.filter(d => !adminSet.has(d)),
      domainFilterEnabled,
      isTutor,
      selectedJournals: allJournals.filter(j => adminJournalSet.has(j)),
      customJournals: allJournals.filter(j => !adminJournalSet.has(j))
    }
  }
}
