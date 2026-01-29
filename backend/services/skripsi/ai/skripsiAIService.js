import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetSkripsiTrustedDomainsService } from '#services/skripsi/getSkripsiTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'

export class SkripsiAIService extends BaseService {
  /**
   * Generate AI response based on tab type with streaming support
   * @param {number} tabId - The tab ID
   * @param {string} message - The user's message
   * @param {string} tabType - The tab type (ai_researcher_1, ai_researcher_2, ai_researcher_3, paraphraser, diagram_builder)
   * @returns {Promise<{stream: AsyncGenerator}>}
   */
  static async call({ tabId, message, tabType }) {
    // Get tab conversation history (fetch more than needed, we'll slice based on config)
    const tab = await prisma.skripsi_tabs.findUnique({
      where: { id: tabId },
      include: {
        messages: {
          orderBy: { created_at: 'asc' },
          take: 50 // Fetch up to 50, will be trimmed based on context_messages setting
        }
      }
    })

    if (!tab) {
      throw new ValidationError('Tab not found')
    }

    // Map tab type to mode (ai_researcher_1/2/3 all use ai_researcher)
    const mode = this.getMode(tabType)

    // Get constants for this mode and global settings
    const constantKeys = [
      'skripsi_is_active',
      `skripsi_${mode}_enabled`,
      `skripsi_${mode}_model`,
      `skripsi_${mode}_context_messages`
    ]

    // For diagram_builder, use separate format and content prompts
    if (mode === 'diagram_builder') {
      constantKeys.push(
        `skripsi_${mode}_format_prompt`,
        `skripsi_${mode}_content_prompt`
      )
    } else {
      constantKeys.push(`skripsi_${mode}_prompt`)
    }

    const constants = await prisma.constants.findMany({
      where: {
        key: { in: constantKeys }
      }
    })

    const constantsMap = {}
    constants.forEach(c => { constantsMap[c.key] = c.value })

    // Check if feature is globally enabled
    const featureActive = constantsMap['skripsi_is_active'] === 'true'
    if (!featureActive) {
      throw new ValidationError('Skripsi Builder feature is currently disabled')
    }

    // Check if mode is enabled
    const modeEnabled = constantsMap[`skripsi_${mode}_enabled`] === 'true'
    if (!modeEnabled) {
      throw new ValidationError(`Mode ${mode} is currently disabled`)
    }

    // Get system prompt and model
    let systemPrompt
    if (mode === 'diagram_builder') {
      const formatPrompt = constantsMap[`skripsi_${mode}_format_prompt`]
      const contentPrompt = constantsMap[`skripsi_${mode}_content_prompt`]

      if (!formatPrompt || !contentPrompt) {
        throw new ValidationError(`System prompts not configured for ${mode}`)
      }

      // Combine both prompts for chat interface
      systemPrompt = `${contentPrompt}\n\n${formatPrompt}`
    } else {
      systemPrompt = constantsMap[`skripsi_${mode}_prompt`]
      if (!systemPrompt) {
        throw new ValidationError(`System prompt not configured for ${mode}`)
      }
    }

    const modelName = constantsMap[`skripsi_${mode}_model`] || 'gemini-2.0-flash-exp'
    const contextMessages = parseInt(constantsMap[`skripsi_${mode}_context_messages`] || '20')

    // Get AI service from router
    console.log(`skripsi_${mode}_model`)
    console.log(modelName)
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} is not supported`)
    }

    // Get conversation history with configurable context length
    const conversationHistory = tab.messages.slice(-contextMessages)

    // Check if using Perplexity model for domain filtering
    const isPerplexity = modelName.startsWith('sonar')

    if (isPerplexity) {
      // Get trusted domains for filtering
      const trustedDomains = await GetSkripsiTrustedDomainsService.call()

      // Build options for Perplexity
      const options = {}

      // Add time filtering based on type
      if (trustedDomains) {
        if (trustedDomains.timeFilterType === 'recency') {
          options.search_recency_filter = trustedDomains.recencyFilter || 'month'
          console.log(`Skripsi AI: using recency filter: ${trustedDomains.recencyFilter}`)
        } else if (trustedDomains.timeFilterType === 'date_range') {
          if (trustedDomains.publishedAfter) {
            options.search_after_date_filter = trustedDomains.publishedAfter
          }
          if (trustedDomains.publishedBefore) {
            options.search_before_date_filter = trustedDomains.publishedBefore
          }
          if (trustedDomains.updatedAfter) {
            options.last_updated_after_filter = trustedDomains.updatedAfter
          }
          if (trustedDomains.updatedBefore) {
            options.last_updated_before_filter = trustedDomains.updatedBefore
          }
          console.log(`Skripsi AI: using date range filters`, {
            published: {
              after: trustedDomains.publishedAfter || 'none',
              before: trustedDomains.publishedBefore || 'none'
            },
            lastUpdated: {
              after: trustedDomains.updatedAfter || 'none',
              before: trustedDomains.updatedBefore || 'none'
            }
          })
        }
      }

      // Add domain filtering if enabled
      if (trustedDomains && trustedDomains.enabled && trustedDomains.domains.length > 0) {
        options.search_domain_filter = trustedDomains.domains
        console.log(`Skripsi AI: filtering to ${trustedDomains.domains.length} trusted domains`)
      }

      // Generate streaming response with Perplexity
      const stream = await ModelService.generateStreamWithHistory(
        modelName,
        systemPrompt,
        conversationHistory,
        message,
        options
      )

      return { stream, sources: [] }
    } else {
      // Generate streaming response with Gemini
      const stream = await ModelService.generateStreamWithHistory(
        modelName,
        systemPrompt,
        conversationHistory,
        message
      )

      return { stream }
    }
  }

  /**
   * Map tab type to mode
   * ai_researcher_1, ai_researcher_2, ai_researcher_3 → ai_researcher
   * paraphraser → paraphraser
   * diagram_builder → diagram_builder
   */
  static getMode(tabType) {
    if (tabType.startsWith('ai_researcher')) {
      return 'ai_researcher'
    }
    return tabType
  }
}
