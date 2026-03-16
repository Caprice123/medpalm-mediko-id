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

    let domainObjects = [] // [{ domain, journal_name }]
    let filterEnabled = true

    // If a user is specified, apply their preferences
    if (userId) {
      const userSettings = await prisma.user_chatbot_settings.findUnique({
        where: { user_id: userId }
      })

      if (userSettings) {
        filterEnabled = userSettings.domain_filter_enabled
        const raw = Array.isArray(userSettings.selected_domains) ? userSettings.selected_domains : []

        // Normalize: handle legacy string array or new { domain, journal_name } array
        const normalized = raw.map(d =>
          typeof d === 'string' ? { domain: d, journal_name: '' } : d
        )

        // If user has selected specific domains, use those
        if (normalized.length > 0) {
          domainObjects = normalized
        }
        // else: user selected none = use all admin domains (domainObjects stays [])
      }
    }

    // domains: plain string array (used by Perplexity filter)
    const domains = domainObjects.map(d => d.domain)

    return {
      enabled: filterEnabled,
      domains,
      domainObjects,
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
