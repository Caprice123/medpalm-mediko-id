import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'

export class UpdateUserChatbotSettingsService extends BaseService {
  static async call(userId, { selectedDomains, domainFilterEnabled }) {
    const domains = Array.isArray(selectedDomains) ? selectedDomains : []

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

    return {
      selectedDomains: settings.selected_domains ?? [],
      domainFilterEnabled: settings.domain_filter_enabled
    }
  }
}
