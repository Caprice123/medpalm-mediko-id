import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetTrustedDomainsService extends BaseService {
  /**
   * Get trusted domains configuration for research mode.
   * If userId is provided, merges user's selected domains on top of admin settings.
   * @param {number|null} userId
   */
  static async call(userId = null) {
    // Time filter config still comes from constants
    const constants = await GetConstantsService.call([
      'chatbot_research_recency_filter',
      'chatbot_research_time_filter_type',
      'chatbot_research_published_after',
      'chatbot_research_published_before',
      'chatbot_research_updated_after',
      'chatbot_research_updated_before'
    ])

    const timeFilterType = constants.chatbot_research_time_filter_type || 'recency'
    const recencyFilter = constants.chatbot_research_recency_filter || 'month'
    const publishedAfter = constants.chatbot_research_published_after || ''
    const publishedBefore = constants.chatbot_research_published_before || ''
    const updatedAfter = constants.chatbot_research_updated_after || ''
    const updatedBefore = constants.chatbot_research_updated_before || ''

    let domains = []
    let filterEnabled = true

    // If a user is specified, apply their preferences
    if (userId) {
      const userSettings = await prisma.user_chatbot_settings.findUnique({
        where: { user_id: userId }
      })

      if (userSettings) {
        filterEnabled = userSettings.domain_filter_enabled
        const userSelected = Array.isArray(userSettings.selected_domains) ? userSettings.selected_domains : []

        // If user has selected specific domains, use those (includes custom user-typed domains)
        if (userSelected.length > 0) {
          domains = userSelected
        }
        // else: user selected none = use all admin domains
      }
    }

    return {
      enabled: filterEnabled,
      domains,
      count: domains.length,
      timeFilterType,
      recencyFilter,
      publishedAfter,
      publishedBefore,
      updatedAfter,
      updatedBefore
    }
  }
}
