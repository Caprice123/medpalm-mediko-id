import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateUserChatbotSettingsService extends BaseService {
  static async call(userId, { selectedDomains, customDomains, domainFilterEnabled, selectedJournals, customJournals }) {
    const MAX_DOMAINS = 20

    const userRecord = await prisma.users.findUnique({ where: { id: userId }, select: { role: true } })
    const isTutor = userRecord?.role === 'tutor'

    // Merge admin-list journals + custom journals, dedup, cap at 20
    const allJournals = [
      ...(Array.isArray(selectedJournals) ? selectedJournals : []),
      ...(Array.isArray(customJournals) ? customJournals : [])
    ]
    const journalsData = allJournals.length > 0
      ? [...new Set(allJournals.map(j => j.trim()).filter(Boolean))].slice(0, 20)
      : (selectedJournals !== undefined || customJournals !== undefined ? [] : undefined)

    let domainsToSave
    if (isTutor) {
      // Tutors filter by journal — no domain storage needed
      domainsToSave = []
    } else {
      // Non-tutor: store as plain string array (domain URL only)
      const picked = Array.isArray(selectedDomains) ? selectedDomains : []
      const custom = Array.isArray(customDomains) ? customDomains : []
      const seen = new Set()
      const domainStrings = []
      for (const item of [...picked, ...custom]) {
        const domain = (typeof item === 'string' ? item : item.domain)?.trim().toLowerCase()
        if (!domain || seen.has(domain)) continue
        seen.add(domain)
        domainStrings.push(domain)
      }
      domainsToSave = domainStrings.slice(0, MAX_DOMAINS)
    }

    const settings = await prisma.user_chatbot_settings.upsert({
      where: { user_id: userId },
      update: {
        selected_domains: domainsToSave,
        domain_filter_enabled: domainFilterEnabled ?? true,
        updated_at: new Date(),
        ...(journalsData !== undefined ? { selected_journals: journalsData } : {})
      },
      create: {
        user_id: userId,
        selected_domains: domainsToSave,
        domain_filter_enabled: domainFilterEnabled ?? true,
        ...(journalsData !== undefined ? { selected_journals: journalsData } : {})
      }
    })

    // Build response: split saved domains back into admin-list vs custom
    const savedDomains = (settings.selected_domains ?? []).map(d =>
      typeof d === 'string' ? d : d.domain
    ).filter(Boolean)

    const adminMatches = savedDomains.length > 0
      ? await prisma.chatbot_research_domains.findMany({
          where: { domain: { in: savedDomains } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    const savedJournals = Array.isArray(settings.selected_journals) ? settings.selected_journals : []
    const adminJournalMatches = savedJournals.length > 0
      ? await prisma.$queryRaw`SELECT name FROM chatbot_journal_names WHERE name = ANY(${savedJournals})`
      : []
    const adminJournalSet = new Set(adminJournalMatches.map(r => r.name))

    return {
      selectedDomains: savedDomains.filter(d => adminSet.has(d)).map(d => ({ domain: d, journal_name: '' })),
      customDomains: savedDomains.filter(d => !adminSet.has(d)),
      domainFilterEnabled: settings.domain_filter_enabled,
      selectedJournals: savedJournals.filter(j => adminJournalSet.has(j)),
      customJournals: savedJournals.filter(j => !adminJournalSet.has(j))
    }
  }
}
