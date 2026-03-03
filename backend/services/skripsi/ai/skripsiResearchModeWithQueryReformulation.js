import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetSkripsiTrustedDomainsService } from '#services/skripsi/getSkripsiTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'

export class SkripsiResearchModeWithQueryReformulation extends BaseService {
  /**
   * Replace placeholders in prompt template with actual values
   * Supports {{placeholder}} syntax (like chatbot research mode)
   * @param {string} template - Template string with {{placeholders}}
   * @param {Object} variables - Key-value pairs to replace
   * @returns {string} Processed template with replaced values
   */
  static replacePlaceholders(template, variables) {
    let result = template
    for (const [key, value] of Object.entries(variables)) {
      const placeholder = `{{${key}}}`
      result = result.replace(new RegExp(placeholder.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), value)
    }
    return result
  }

  /**
   * TWO-STAGE APPROACH (same as chatbot research mode):
   * 1. Reformulate Indonesian query with context + Translate to English (Gemini)
   * 2. Search with Perplexity using English query + domain filter
   * 3. Respond in Indonesian with English academic/medical terms
   */
  static async call({ tabId, message, tabType }) {
      // Map tab type to mode (ai_researcher_1/2/3 all use ai_researcher)
      const mode = this.getMode(tabType)

      // Get configuration constants
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              `skripsi_${mode}_enabled`,
              `skripsi_${mode}_model`,
              `skripsi_${mode}_reformulation_model`,
              `skripsi_${mode}_reformulation_prompt`,
              `skripsi_${mode}_context_messages`,
              `skripsi_${mode}_system_prompt`,
              `skripsi_${mode}_citations_count`,
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeEnabled = constantsMap[`skripsi_${mode}_enabled`] === 'true'
      if (!modeEnabled) {
        throw new ValidationError(`Mode ${mode} is currently disabled`)
      }

      const model = constantsMap[`skripsi_${mode}_model`]
      const reformulationModel = constantsMap[`skripsi_${mode}_reformulation_model`] || 'gemini-2.0-flash-exp'
      const reformulationPrompt = constantsMap[`skripsi_${mode}_reformulation_prompt`]
      const contextMessages = parseInt(constantsMap[`skripsi_${mode}_context_messages`] || '10')
      const systemPrompt = constantsMap[`skripsi_${mode}_system_prompt`]
      const citationsCount = parseInt(constantsMap[`skripsi_${mode}_citations_count`] || '10')

      // Get trusted domains
      const trustedDomains = await GetSkripsiTrustedDomainsService.call()

      // Get tab conversation history - fetch based on constant
      const messages = await prisma.skripsi_messages.findMany({
        where: {
          tab_id: tabId
        },
        orderBy: { id: 'desc' },
        take: contextMessages,
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

    try {
      // Check if using Perplexity model
      const isPerplexity = model.startsWith('sonar')

      if (!isPerplexity) {
        throw new ValidationError('Query reformulation only works with Perplexity (sonar) models')
      }

      // STAGE 1: Reformulate query with context + Translate to English (if prompt is configured)
      let englishSearchQuery = message

      if (reformulationPrompt && reformulationPrompt.trim()) {
        englishSearchQuery = await this.reformulateAndTranslateQuery(
          message,
          conversationHistory,
          reformulationModel,
          reformulationPrompt
        )
        console.log('🔄 Skripsi query reformulation:', message, '→', englishSearchQuery)
      } else {
        console.log('⏭️  Skipping query reformulation (no prompt configured)')
      }

      // STAGE 2: Search with English query
      const result = await this.callPerplexityWithEnglishQuery(
        model,
        message, // Original query (Indonesian or English)
        englishSearchQuery, // Reformulated English query for search
        conversationHistory,
        systemPrompt,
        citationsCount,
        trustedDomains
      )

      return {
        stream: result.stream,
        sources: result.sources,
        provider: RouterUtils.getProvider(model),
      }
    } catch (error) {
      console.error('Error in Skripsi Research Mode AI Service:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  /**
   * Stage 1: Query Reformulation + Translation
   * Similar to chatbot research mode's query rewrite
   * Handles contextual references and conversation flow
   * Uses RouterUtils to support multiple AI providers (Gemini, Claude, etc.)
   *
   * @param {string} query - Current user query (could be Indonesian or English)
   * @param {Array} conversationHistory - Full conversation history (already filtered by contextMessages)
   * @param {string} reformulationModel - AI model to use for reformulation
   * @param {string} reformulationPrompt - Template prompt from constants
   */
  static async reformulateAndTranslateQuery(query, conversationHistory, reformulationModel, reformulationPrompt) {
    try {
      // Build conversation context from ALL filtered messages
      // The conversation is already filtered by contextMessages in the caller
      let conversationContext = ''
      if (conversationHistory.length > 0) {
        conversationContext = conversationHistory
          .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
          .join('\n')
      }

      // Replace placeholders in prompt template (similar to chatbot research mode)
      const prompt = this.replacePlaceholders(reformulationPrompt, {
        conversation_history: conversationContext || 'No previous conversation',
        user_query: query
      })

      // Use RouterUtils to get the appropriate AI service
      const AIService = RouterUtils.call(reformulationModel)
      if (!AIService) {
        throw new Error(`AI service not found for model: ${reformulationModel}`)
      }

      // Call AI service to reformulate query
      const result = await AIService.generateFromText(
        reformulationModel,
        prompt,
        [] // No conversation history needed for the reformulation itself
      )

      // Extract reformulated query (handle different response formats)
      let reformulatedEnglishQuery
      if (typeof result === 'string') {
        reformulatedEnglishQuery = result.trim()
      } else if (result.text) {
        reformulatedEnglishQuery = result.text.trim()
      } else if (result.content) {
        reformulatedEnglishQuery = result.content.trim()
      } else {
        throw new Error('Unexpected response format from AI service')
      }

      console.log('📝 Skripsi query reformulation:')
      console.log(`   Model: ${reformulationModel}`)
      console.log(`   Original: "${query}"`)
      console.log(`   Reformulated: "${reformulatedEnglishQuery}"`)

      return reformulatedEnglishQuery

    } catch (error) {
      console.error('Error reformulating query:', error)
      // Fallback: use original query
      console.log('⚠️  Falling back to original query')
      return query
    }
  }

  /**
   * Stage 2: Search with English query but respond in Indonesian/original language
   *
   * @param {string} model - Perplexity model name
   * @param {string} originalQuery - Original query from user
   * @param {string} englishSearchQuery - Reformulated English search query
   * @param {Array} conversationHistory - Conversation history
   * @param {string} systemPrompt - System prompt (includes response instructions)
   * @param {number} citationsCount - Number of citations to include
   * @param {Object} trustedDomains - Trusted domains configuration
   */
  static async callPerplexityWithEnglishQuery(
    model,
    originalQuery,
    englishSearchQuery,
    conversationHistory,
    systemPrompt,
    citationsCount,
    trustedDomains
  ) {
      // Use RouterUtils to get AI service (will be Perplexity for sonar models)
      const AIService = RouterUtils.call(model)
      if (!AIService) {
        throw new ValidationError(`AI service not found for model: ${model}`)
      }

      // Build enhanced user message with search context
      const userMessage = `Search: "${englishSearchQuery}"\n\nQuestion: ${originalQuery}\n\nProvide detailed academic answer with citations.`

      // Build options for search
      const options = {
        temperature: 0.7,
        return_citations: true,
        return_images: false,
      }

      // Add domain filtering if enabled
      if (trustedDomains?.enabled && trustedDomains.domains.length > 0) {
        options.search_domain_filter = trustedDomains.domains
        console.log(`Skripsi research mode: filtering to ${trustedDomains.domains.length} trusted domains`)
      }

      // Add time filtering based on type
      if (trustedDomains) {
        if (trustedDomains.timeFilterType === 'recency') {
          options.search_recency_filter = trustedDomains.recencyFilter || 'month'
          console.log(`Skripsi research mode: using recency filter: ${trustedDomains.recencyFilter}`)
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
          console.log(`Skripsi research mode: using date range filters`, {
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

      console.log('🔍 Skripsi search request:', {
        model: model,
        englishSearchQuery,
        originalQuery: originalQuery,
        domainFilterEnabled: !!options.search_domain_filter
      })

      // Use AIService.generateStreamWithHistory via RouterUtils
      const stream = await AIService.generateStreamWithHistory(
        model,
        systemPrompt, // System prompt (already includes response instructions)
        conversationHistory,
        userMessage,
        options
      )

      return {
        stream: stream,
        sources: [],
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
