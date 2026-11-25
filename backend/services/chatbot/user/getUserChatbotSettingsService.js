import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ChatbotResearchRegistryV2 } from '#services/chatbot/v2/chatbotResearchRegistryV2'

export class GetUserChatbotSettingsService extends BaseService {
  /**
   * The signed-in user's research settings for one provider. Each provider keeps
   * its own row, so the caller may name one; left out, the provider research mode
   * is currently running answers, which is the row the settings modal should show.
   * @param {number} userId
   * @param {string|null} researchProvider - 'openalex' | 'perplexity'
   */
  static async call(userId, researchProvider = null) {
    const provider = researchProvider || (await ChatbotResearchRegistryV2.resolve()).retriever

    const [userSettings, userRecord] = await Promise.all([
      prisma.user_chatbot_settings.findFirst({ where: { user_id: userId, research_provider: provider } }),
      prisma.users.findUnique({ where: { id: userId }, select: { role: true } })
    ])

    const isTutor = userRecord?.role === 'tutor'
    const domainFilterEnabled = userSettings?.domain_filter_enabled ?? true

    // Non-tutor: selected_domains is a plain string array
    const rawDomains = Array.isArray(userSettings?.selected_domains) ? userSettings.selected_domains : []
    const domainStrings = rawDomains.map(d => typeof d === 'string' ? d : d.domain).filter(Boolean)

    const adminMatches = domainStrings.length > 0
      ? await prisma.chatbot_research_domains.findMany({
          where: { domain: { in: domainStrings } },
          select: { domain: true }
        })
      : []
    const adminSet = new Set(adminMatches.map(d => d.domain))

    // Split journals into admin-list vs custom
    const allJournals = Array.isArray(userSettings?.selected_journals) ? userSettings.selected_journals : []
    const adminJournalMatches = allJournals.length > 0
      ? await prisma.$queryRaw`SELECT name FROM chatbot_journal_names WHERE name = ANY(${allJournals})`
      : []
    const adminJournalSet = new Set(adminJournalMatches.map(r => r.name))

    return {
      selectedDomains: domainStrings.filter(d => adminSet.has(d)).map(d => ({ domain: d, journal_name: '' })),
      customDomains: domainStrings.filter(d => !adminSet.has(d)),
      domainFilterEnabled,
      isTutor,
      selectedJournals: allJournals.filter(j => adminJournalSet.has(j)),
      customJournals: allJournals.filter(j => !adminJournalSet.has(j)),
      latestYears: userSettings?.latest_years ?? null,
      yearFrom: userSettings?.year_from ?? null,
      yearTo: userSettings?.year_to ?? null,
    }
  }
}
