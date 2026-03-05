import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class GetUserChatbotSettingsService extends BaseService {
  static async call(userId) {
    // Get all active domains from admin-managed list
    const adminDomains = await prisma.chatbot_research_domains.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'asc' },
      select: { id: true, domain: true }
    })

    // Get user's saved preferences
    const userSettings = await prisma.user_chatbot_settings.findUnique({
      where: { user_id: userId }
    })

    const selectedDomains = userSettings?.selected_domains ?? []
    const domainFilterEnabled = userSettings?.domain_filter_enabled ?? true

    return {
      selectedDomains,    // array of domain strings the user has selected
      domainFilterEnabled,
      availableDomains: adminDomains // full admin list for the UI to render checkboxes
    }
  }
}
