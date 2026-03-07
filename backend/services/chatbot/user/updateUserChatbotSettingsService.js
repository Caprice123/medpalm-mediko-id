import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateUserChatbotSettingsService extends BaseService {
  static async call(userId, { selectedDomains, customDomains, domainFilterEnabled }) {
    const MAX_DOMAINS = 20
    const picked = Array.isArray(selectedDomains) ? selectedDomains : []
    const custom = Array.isArray(customDomains) ? customDomains : []
    const domains = [...new Set([...picked, ...custom])].slice(0, MAX_DOMAINS)

    const settings = await prisma.user_chatbot_settings.upsert({
      where: { user_id: userId },
      update: {
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true,
        updated_at: new Date()
      },
      create: {
        user_id: userId,
        selected_domains: domains,
        domain_filter_enabled: domainFilterEnabled ?? true
      }
    })

    // Split saved domains back into admin-list vs custom (same as GET)
    const allSaved = settings.selected_domains ?? []
    const adminMatches = allSaved.length > 0
      ? await prisma.chatbot_research_domains.findMany({
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
