import prisma from '#prisma/client'
import { BaseService } from '#services/baseService'
import { ValidationError } from '#errors/validationError'
import { GetTrustedDomainsService } from '#services/chatbot/getTrustedDomainsService'
import { RouterUtils } from '#utils/aiUtils/routerUtils'

export class ResearchModeWithQueryReformulation extends BaseService {
  /**
   * Replace placeholders in prompt template with actual values
   * Supports {{placeholder}} syntax (like validated search mode)
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
   * TWO-STAGE APPROACH:
   * 1. Reformulate Indonesian query with context + Translate to English (Gemini)
   * 2. Search with Perplexity using English query + domain filter
   * 3. Respond in Indonesian with English medical terms
   */
  static async call({ userId, conversationId, message }) {
    try {
      // Get configuration
      const constants = await prisma.constants.findMany({
        where: {
          key: {
            in: [
              'chatbot_research_enabled',
              'chatbot_research_model',
              'chatbot_research_reformulation_model',
              'chatbot_research_reformulation_prompt',
              'chatbot_research_last_message_count',
              'chatbot_research_system_prompt', // Includes response instructions
              'chatbot_research_citations_count',
            ]
          }
        }
      })

      const constantsMap = {}
      constants.forEach(c => { constantsMap[c.key] = c.value })

      const modeActive = constantsMap.chatbot_research_enabled === 'true'
      if (!modeActive) {
        throw new ValidationError("Research mode sedang tidak aktif. Silakan pilih mode lain")
      }

      const model = constantsMap.chatbot_research_model
      const reformulationModel = constantsMap.chatbot_research_reformulation_model || 'gemini-2.0-flash-exp'
      const reformulationPrompt = constantsMap.chatbot_research_reformulation_prompt
      const lastMessageCount = parseInt(constantsMap.chatbot_research_last_message_count) || 10
      const systemPrompt = constantsMap.chatbot_research_system_prompt // Already includes response instructions
      const citationsCount = parseInt(constantsMap.chatbot_research_citations_count) || 5

      // Get trusted domains
      const trustedDomains = await GetTrustedDomainsService.call()

      // Get conversation history
      const messages = await prisma.chatbot_messages.findMany({
        where: {
          conversation_id: conversationId,
          is_deleted: false
        },
        orderBy: { id: 'desc' },
        take: lastMessageCount,
        select: {
          sender_type: true,
          content: true
        }
      })

      const conversationHistory = messages.reverse()

      // STAGE 1: Reformulate query with context + Translate to English
      const englishSearchQuery = await this.reformulateAndTranslateQuery(
        message,
        conversationHistory,
        reformulationModel,
        reformulationPrompt
      )
      console.log('🔄 Query reformulation:', message, '→', englishSearchQuery)

      // STAGE 2: Search with English query
      const result = await this.callPerplexityWithEnglishQuery(
        model,
        message, // Original Indonesian query
        englishSearchQuery, // Translated English query for search
        conversationHistory,
        systemPrompt, // Already includes response instructions
        citationsCount,
        trustedDomains
      )

      return {
        stream: result.stream,
        provider: RouterUtils.getProvider(model),
        sources: result.sources
      }
    } catch (error) {
      console.error('Error in Research Mode AI Service:', error)
      throw new Error('Failed to generate research response: ' + error.message)
    }
  }

  /**
   * Stage 1: Query Reformulation + Translation
   * Similar to validated search mode's query rewrite, but also translates to English
   * Handles contextual references and conversation flow
   * Uses RouterUtils to support multiple AI providers (Gemini, Claude, etc.)
   *
   * @param {string} indonesianQuery - Current user query
   * @param {Array} conversationHistory - Full conversation history (already filtered by lastMessageCount)
   * @param {string} reformulationModel - AI model to use for reformulation
   * @param {string} reformulationPrompt - Template prompt from constants
   */
  static async reformulateAndTranslateQuery(indonesianQuery, conversationHistory, reformulationModel, reformulationPrompt) {
    try {
      // Build conversation context from ALL filtered messages (not just last 5)
      // The conversation is already filtered by lastMessageCount in the caller
      let conversationContext = ''
      if (conversationHistory.length > 0) {
        conversationContext = conversationHistory
          .map(msg => `${msg.sender_type === 'user' ? 'User' : 'AI'}: ${msg.content}`)
          .join('\n')
      }

      // Replace placeholders in prompt template (similar to validated search mode)
      const prompt = this.replacePlaceholders(reformulationPrompt, {
        conversation_history: conversationContext || 'No previous conversation',
        user_query: indonesianQuery
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

      console.log('📝 Query reformulation:')
      console.log(`   Model: ${reformulationModel}`)
      console.log(`   Original: "${indonesianQuery}"`)
      console.log(`   Reformulated: "${reformulatedEnglishQuery}"`)

      return reformulatedEnglishQuery

    } catch (error) {
      console.error('Error reformulating query:', error)
      // Fallback: use original query
      console.log('⚠️  Falling back to original query')
      throw new Error
      return indonesianQuery
    }
  }

  /**
   * Stage 2: Search with English query but respond in Indonesian
   *
   * @param {string} model - Perplexity model name
   * @param {string} originalIndonesianQuery - Original query from user
   * @param {string} englishSearchQuery - Reformulated English search query
   * @param {Array} conversationHistory - Conversation history
   * @param {string} systemPrompt - System prompt (includes response instructions)
   * @param {number} citationsCount - Number of citations to include
   * @param {Object} trustedDomains - Trusted domains configuration
   */
  static async callPerplexityWithEnglishQuery(
    model,
    originalIndonesianQuery,
    englishSearchQuery,
    conversationHistory,
    systemPrompt,
    citationsCount,
    trustedDomains
  ) {
    try {
      // Use RouterUtils to get AI service (will be Perplexity for sonar models)
      const AIService = RouterUtils.call(model)
      if (!AIService) {
        throw new ValidationError(`AI service not found for model: ${model}`)
      }

      // Build enhanced user message with search context
      const userMessage = `Search: "${englishSearchQuery}"\n\nQuestion: ${originalIndonesianQuery}\n\nProvide detailed medical answer with citations.`

      // Build options for search
      const options = {
        temperature: 0.7,
        return_citations: true,
        return_images: false,
      }

      // Add domain filtering if enabled
      if (trustedDomains?.enabled && trustedDomains.domains.length > 0) {
        options.search_domain_filter = trustedDomains.domains
        console.log(`Research mode: filtering to ${trustedDomains.domains.length} trusted domains`)
      }

      // Add time filtering
      if (trustedDomains) {
        if (trustedDomains.timeFilterType === 'recency') {
          options.search_recency_filter = trustedDomains.recencyFilter || 'month'
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
        }
      }

      console.log('🔍 Search request:', {
        model: model,
        englishSearchQuery,
        originalQuery: originalIndonesianQuery,
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
        provider: RouterUtils.getProvider(model),
      }
    } catch (error) {
      console.error('Error calling Perplexity API:', error)
      throw error
    }
  }
}
