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
      'skripsi_ai_researcher_recency_filter',
      'skripsi_ai_researcher_time_filter_type',
      'skripsi_ai_researcher_published_after',
      'skripsi_ai_researcher_published_before',
      'skripsi_ai_researcher_updated_after',
      'skripsi_ai_researcher_updated_before'
    ])

    const timeFilterType = constants.skripsi_ai_researcher_time_filter_type || 'recency'
    const recencyFilter = constants.skripsi_ai_researcher_recency_filter || 'month'
    const publishedAfter = constants.skripsi_ai_researcher_published_after || ''
    const publishedBefore = constants.skripsi_ai_researcher_published_before || ''
    const updatedAfter = constants.skripsi_ai_researcher_updated_after || ''
    const updatedBefore = constants.skripsi_ai_researcher_updated_before || ''
    
    let domains = []
    let filterEnabled = true

    // If a set is specified, apply its preferences
    if (setId) {
      const setSettings = await prisma.skripsi_set_settings.findUnique({
        where: { set_id: setId }
      })

      if (setSettings) {
        filterEnabled = setSettings.domain_filter_enabled
        const setSelected = Array.isArray(setSettings.selected_domains) ? setSettings.selected_domains : []

        // Use all selected domains including user-typed custom ones
        if (setSelected.length > 0) {
          domains = setSelected
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
