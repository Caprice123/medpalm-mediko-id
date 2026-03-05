import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { GetConstantsService } from '#services/constant/getConstantsService'

export class GetSkripsiTrustedDomainsService extends BaseService {
  /**
   * Get trusted domains for Skripsi AI researcher mode.
   * If setId is provided, merges the set's selected domains on top of admin settings.
   * @param {number|null} setId
   */
  static async call(setId = null) {
    // Time filter config still comes from constants
    const constants = await GetConstantsService.call([
      'skripsi_ai_researcher_domain_filter_enabled',
      'skripsi_ai_researcher_recency_filter',
      'skripsi_ai_researcher_time_filter_type',
      'skripsi_ai_researcher_published_after',
      'skripsi_ai_researcher_published_before',
      'skripsi_ai_researcher_updated_after',
      'skripsi_ai_researcher_updated_before'
    ])

    const adminFilterEnabled = constants.skripsi_ai_researcher_domain_filter_enabled === 'true'
    const timeFilterType = constants.skripsi_ai_researcher_time_filter_type || 'recency'
    const recencyFilter = constants.skripsi_ai_researcher_recency_filter || 'month'
    const publishedAfter = constants.skripsi_ai_researcher_published_after || ''
    const publishedBefore = constants.skripsi_ai_researcher_published_before || ''
    const updatedAfter = constants.skripsi_ai_researcher_updated_after || ''
    const updatedBefore = constants.skripsi_ai_researcher_updated_before || ''

    // Domain list comes from the skripsi_research_domains table
    const adminDomains = await prisma.skripsi_research_domains.findMany({
      where: { is_active: true },
      orderBy: { created_at: 'asc' },
      select: { domain: true }
    })
    const adminDomainList = adminDomains.map(d => d.domain)

    let domains = adminDomainList
    let filterEnabled = adminFilterEnabled

    // If a set is specified, apply its preferences
    if (setId) {
      const set = await prisma.skripsi_sets.findUnique({
        where: { id: setId },
        select: { selected_domains: true, domain_filter_enabled: true }
      })

      if (set) {
        filterEnabled = set.domain_filter_enabled
        const setSelected = Array.isArray(set.selected_domains) ? set.selected_domains : []

        if (setSelected.length > 0) {
          domains = setSelected.filter(d => adminDomainList.includes(d))
        }
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
