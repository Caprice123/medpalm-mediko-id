import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetSkripsiTrustedDomainsService } from '#services/skripsi/getSkripsiTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'
import { SkripsiResearchModeWithQueryReformulation } from '#services/skripsi/ai/skripsiResearchModeWithQueryReformulation'
import { SkripsiValidatedSearchModeAIService } from '#services/skripsi/ai/skripsiValidatedSearchModeAIService'

export class SkripsiAIService extends BaseService {
  /**
   * Generate AI response based on tab type and mode with streaming support
   * @param {number} tabId - The tab ID
   * @param {string} message - The user's message
   * @param {string} tabType - The tab type (ai_researcher_1, ai_researcher_2, ai_researcher_3, paraphraser, diagram_builder)
   * @param {string} modeType - The mode type for AI Chat tabs (research, validated) - optional, defaults to validated
   * @returns {Promise<{stream: AsyncGenerator}>}
   */
  static async call({ tabId, message, tabType, modeType = 'validated' }) {
    // Map tab type to mode first
    const mode = this.getMode(tabType)
    console.log(mode, modeType)

    // For AI Chat tabs (ai_researcher_1/2/3), route based on modeType
    if (mode === 'ai_researcher') {
      if (modeType === 'validated') {
        console.log('📚 Using Validated Search mode for Skripsi AI Chat')
        // Get tab info for userId
        const tab = await prisma.skripsi_tabs.findUnique({
          where: { id: tabId },
          include: {
            skripsi_set: {
              select: { user_id: true }
            }
          }
        })

        if (!tab) {
          throw new ValidationError('Tab not found')
        }

        return await SkripsiValidatedSearchModeAIService.call({
          userId: tab.skripsi_set.user_id,
          tabId,
          message
        })
      } else if (modeType === 'research') {
        console.log('🔍 Using Research mode for Skripsi AI Chat')
        // Check if using Perplexity model for research mode
        const modelCheck = await prisma.constants.findUnique({
          where: { key: `skripsi_${mode}_model` }
        })

        const modelName = modelCheck?.value || 'gemini-2.0-flash-exp'
        const isPerplexity = modelName.startsWith('sonar')

        if (isPerplexity) {
          console.log('🔄 Using query reformulation (Perplexity mode)')
          return await SkripsiResearchModeWithQueryReformulation.call({ tabId, message, tabType })
        }

        console.log('⏭️  Using standard research mode (Gemini mode)')
      }
    }

    // For non-AI Chat tabs (paraphraser, diagram_builder) or Gemini research mode, use original logic

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

    // Get constants for this mode and global settings
    const constantKeys = [
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

    const contextMessages = parseInt(constantsMap[`skripsi_${mode}_context_messages`] || '20')

    // Get AI service from router
    console.log(`skripsi_${mode}_model`)
    const ModelService = RouterUtils.call(modelName)
    if (!ModelService) {
      throw new ValidationError(`Model ${modelName} is not supported`)
    }

    // Get conversation history with configurable context length
    const conversationHistory = tab.messages.slice(-contextMessages)

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
