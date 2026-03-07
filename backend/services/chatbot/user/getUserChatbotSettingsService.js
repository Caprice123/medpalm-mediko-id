import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserChatbotSettingsService extends BaseService {
  static async call(userId) {
    // Get user's saved preferences
    const userSettings = await prisma.user_chatbot_settings.findUnique({
      where: { user_id: userId }
    })

    const allSelected = userSettings?.selected_domains ?? []
    const domainFilterEnabled = userSettings?.domain_filter_enabled ?? true

    // Split: domains that exist in the admin list vs user-typed custom ones
    const adminMatches = allSelected.length > 0
      ? await prisma.chatbot_research_domains.findMany({
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
