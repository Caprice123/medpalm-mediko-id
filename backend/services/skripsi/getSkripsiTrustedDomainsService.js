import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetSkripsiTrustedDomainsService extends BaseService {
  /**
   * Get trusted domains configuration for Skripsi AI Researcher mode
   * @returns {Promise<{enabled: boolean, domains: string[], recencyFilter: string, ...}>}
   */
  static async call() {
    const constants = await GetConstantsService.call([
      'skripsi_ai_researcher_trusted_domains',
      'skripsi_ai_researcher_domain_filter_enabled',
      'skripsi_ai_researcher_recency_filter',
      'skripsi_ai_researcher_time_filter_type',
      'skripsi_ai_researcher_published_after',
      'skripsi_ai_researcher_published_before',
      'skripsi_ai_researcher_updated_after',
      'skripsi_ai_researcher_updated_before'
    ])

    const enabled = constants.skripsi_ai_researcher_domain_filter_enabled === 'true'
    const domainsString = constants.skripsi_ai_researcher_trusted_domains || ''
    const timeFilterType = constants.skripsi_ai_researcher_time_filter_type || 'recency'
    const recencyFilter = constants.skripsi_ai_researcher_recency_filter || 'month'

    // Date range filters
    const publishedAfter = constants.skripsi_ai_researcher_published_after || ''
    const publishedBefore = constants.skripsi_ai_researcher_published_before || ''
    const updatedAfter = constants.skripsi_ai_researcher_updated_after || ''
    const updatedBefore = constants.skripsi_ai_researcher_updated_before || ''

    // Parse comma-separated domains
    const domains = domainsString
      .split(',')
      .map(d => d.trim())
      .filter(d => d.length > 0)

    return {
      enabled: enabled,
      domains: domains,
      count: domains.length,
      timeFilterType: timeFilterType,
      recencyFilter: recencyFilter,
      publishedAfter: publishedAfter,
      publishedBefore: publishedBefore,
      updatedAfter: updatedAfter,
      updatedBefore: updatedBefore
    }
  }
}
